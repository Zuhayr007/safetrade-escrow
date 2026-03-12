import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Upload, User, FileText, CheckCircle2 } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const STEPS = [
  { label: "Account", icon: User },
  { label: "Identity", icon: FileText },
  { label: "Document", icon: Upload },
];

export function KycSignupForm({ onComplete }: Props) {
  const { signUp } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1 — Account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  // Step 2 — Identity
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [address, setAddress] = useState("");

  // Step 3 — Document
  const [docFile, setDocFile] = useState<File | null>(null);

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleAccountStep = async () => {
    if (!email || !password || !displayName) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setStep(1);
  };

  const handleIdentityStep = () => {
    if (!fullName.trim() || !phone.trim() || !idNumber.trim() || !address.trim()) {
      toast({ title: "Please fill in all identity fields", variant: "destructive" });
      return;
    }
    if (!/^\+?\d{7,15}$/.test(phone.replace(/[\s-]/g, ""))) {
      toast({ title: "Please enter a valid phone number", variant: "destructive" });
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!docFile) {
      toast({ title: "Please upload your ID document", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // 1. Create account
      const { error: signUpError } = await signUp(email, password, displayName);
      if (signUpError) throw signUpError;

      // Wait for session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If email confirmation is required, show message
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account, then log in to complete KYC.",
        });
        onComplete();
        return;
      }

      const userId = session.user.id;

      // 2. Upload document
      const fileExt = docFile.name.split(".").pop();
      const filePath = `${userId}/id-document.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("kyc-documents")
        .upload(filePath, docFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("kyc-documents")
        .getPublicUrl(filePath);

      // 3. Update profile with KYC info
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim(),
          id_number: idNumber.trim(),
          address: address.trim(),
          id_document_url: urlData.publicUrl,
          kyc_status: "pending",
        })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      toast({
        title: "Account created!",
        description: "Your KYC verification is pending admin approval.",
      });
      onComplete();
    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <div className="space-y-3">
        <div className="flex justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-sm transition-colors ${
                    isDone
                      ? "bg-primary text-primary-foreground"
                      : isActive
                      ? "bg-primary/20 text-primary border-2 border-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`text-xs ${isActive ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Step 1: Account */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="kyc-name">Display Name</Label>
            <Input id="kyc-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="kyc-email">Email</Label>
            <Input id="kyc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="kyc-password">Password</Label>
            <Input
              id="kyc-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button onClick={handleAccountStep} className="w-full">
            Next — Identity Details
          </Button>
        </div>
      )}

      {/* Step 2: Identity */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="kyc-fullname">Full Legal Name</Label>
            <Input id="kyc-fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="As it appears on your ID" required />
          </div>
          <div>
            <Label htmlFor="kyc-phone">Phone Number</Label>
            <Input id="kyc-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 XX XXX XXXX" required />
          </div>
          <div>
            <Label htmlFor="kyc-id">ID / Passport Number</Label>
            <Input id="kyc-id" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="kyc-address">Residential Address</Label>
            <Input id="kyc-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address" required />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
              Back
            </Button>
            <Button onClick={handleIdentityStep} className="flex-1">
              Next — Upload Document
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Document Upload */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <Label>ID Document (Passport / Driver's License / National ID)</Label>
            <div className="mt-2">
              <label
                htmlFor="kyc-doc"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-muted-foreground/25 hover:border-primary/50 transition-colors bg-muted/30"
              >
                {docFile ? (
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <FileText className="h-5 w-5 text-primary" />
                    {docFile.name}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm">Click to upload</span>
                    <span className="text-xs">JPG, PNG, or PDF (max 5MB)</span>
                  </div>
                )}
                <input
                  id="kyc-doc"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.size > 5 * 1024 * 1024) {
                      toast({ title: "File too large", description: "Max 5MB allowed", variant: "destructive" });
                      return;
                    }
                    setDocFile(file ?? null);
                  }}
                />
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading ? "Creating account..." : "Submit & Create Account"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
