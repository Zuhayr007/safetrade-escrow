import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ShieldCheck, ShieldX, FileText, Eye } from 'lucide-react';
import type { Profile, AppRole, KycStatus } from '@/types/escrow';

interface UserWithRoles extends Profile {
  roles: AppRole[];
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectDialogUser, setRejectDialogUser] = useState<UserWithRoles | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [docPreviewUrl, setDocPreviewUrl] = useState<string | null>(null);

  const fetchUsers = async () => {
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { data: roles } = await supabase.from('user_roles').select('*');

    const usersWithRoles = (profiles ?? []).map(p => ({
      ...p,
      roles: (roles ?? []).filter(r => r.user_id === p.user_id).map(r => r.role) as AppRole[],
    }));
    setUsers(usersWithRoles);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel('admin-users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_roles' }, () => fetchUsers())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchUsers())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const addRole = async (userId: string, role: AppRole) => {
    const { error } = await supabase.from('user_roles').upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });
    if (error) {
      toast({ title: 'Error adding role', variant: 'destructive' });
    } else {
      toast({ title: `Role "${role}" added` });
      fetchUsers();
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', role);
    toast({ title: `Role "${role}" removed` });
    fetchUsers();
  };

  const approveKyc = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ kyc_status: 'approved', kyc_rejected_reason: null })
      .eq('user_id', userId);
    if (error) {
      toast({ title: 'Error approving KYC', variant: 'destructive' });
    } else {
      toast({ title: 'KYC approved' });
      fetchUsers();
    }
  };

  const rejectKyc = async () => {
    if (!rejectDialogUser) return;
    const { error } = await supabase
      .from('profiles')
      .update({ kyc_status: 'rejected', kyc_rejected_reason: rejectReason.trim() || 'Documents not valid' })
      .eq('user_id', rejectDialogUser.user_id);
    if (error) {
      toast({ title: 'Error rejecting KYC', variant: 'destructive' });
    } else {
      toast({ title: 'KYC rejected' });
      fetchUsers();
    }
    setRejectDialogUser(null);
    setRejectReason('');
  };

  const pendingUsers = users.filter(u => u.kyc_status === 'pending');
  const allUsers = users;

  const kycBadge = (status: KycStatus) => {
    const map: Record<KycStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: 'Pending', variant: 'outline' },
      approved: { label: 'Approved', variant: 'default' },
      rejected: { label: 'Rejected', variant: 'destructive' },
    };
    const { label, variant } = map[status] || map.pending;
    return <Badge variant={variant}>{label}</Badge>;
  };

  const UserCard = ({ u }: { u: UserWithRoles }) => (
    <Card key={u.id}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold">{u.display_name}</p>
            <p className="text-sm text-muted-foreground">{u.email}</p>
            {u.full_name && <p className="text-xs text-muted-foreground">Legal: {u.full_name}</p>}
            {u.phone && <p className="text-xs text-muted-foreground">Phone: {u.phone}</p>}
          </div>
          <div className="flex items-center gap-2">
            {kycBadge(u.kyc_status)}
          </div>
        </div>

        {/* KYC actions for pending users */}
        {u.kyc_status === 'pending' && (
          <div className="flex items-center gap-2 flex-wrap">
            {u.id_document_url && (
              <Button size="sm" variant="outline" onClick={() => setDocPreviewUrl(u.id_document_url)}>
                <Eye className="h-3 w-3 mr-1" /> View ID
              </Button>
            )}
            <Button size="sm" onClick={() => approveKyc(u.user_id)}>
              <ShieldCheck className="h-3 w-3 mr-1" /> Approve
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setRejectDialogUser(u)}>
              <ShieldX className="h-3 w-3 mr-1" /> Reject
            </Button>
          </div>
        )}

        {/* Roles */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1">
            {u.roles.map(r => (
              <Badge key={r} variant="secondary" className="cursor-pointer" onClick={() => removeRole(u.user_id, r)}>
                {r} ×
              </Badge>
            ))}
          </div>
          <Select onValueChange={(v) => addRole(u.user_id, v as AppRole)}>
            <SelectTrigger className="w-28 h-8 text-xs">
              <SelectValue placeholder="Add role" />
            </SelectTrigger>
            <SelectContent>
              {(['buyer', 'seller', 'admin'] as AppRole[])
                .filter(r => !u.roles.includes(r))
                .map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
      ) : (
        <Tabs defaultValue={pendingUsers.length > 0 ? "pending" : "all"}>
          <TabsList>
            <TabsTrigger value="pending">
              Pending KYC {pendingUsers.length > 0 && `(${pendingUsers.length})`}
            </TabsTrigger>
            <TabsTrigger value="all">All Users ({allUsers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            {pendingUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending KYC verifications</p>
            ) : (
              <div className="grid gap-3">
                {pendingUsers.map(u => <UserCard key={u.id} u={u} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            <div className="grid gap-3">
              {allUsers.map(u => <UserCard key={u.id} u={u} />)}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Reject dialog */}
      <Dialog open={!!rejectDialogUser} onOpenChange={() => setRejectDialogUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject KYC for {rejectDialogUser?.display_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for rejection</label>
            <Input
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Document is blurry or expired"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogUser(null)}>Cancel</Button>
            <Button variant="destructive" onClick={rejectKyc}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document preview dialog */}
      <Dialog open={!!docPreviewUrl} onOpenChange={() => setDocPreviewUrl(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ID Document</DialogTitle>
          </DialogHeader>
          {docPreviewUrl && (
            docPreviewUrl.endsWith('.pdf') ? (
              <iframe src={docPreviewUrl} className="w-full h-96 rounded border" />
            ) : (
              <img src={docPreviewUrl} alt="ID Document" className="w-full rounded" />
            )
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
