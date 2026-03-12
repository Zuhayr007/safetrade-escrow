import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, XCircle, ShieldCheck } from "lucide-react";

export default function KycPending() {
  const { profile, signOut } = useAuth();

  const isRejected = profile?.kyc_status === "rejected";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-2">
            {isRejected ? (
              <XCircle className="h-16 w-16 text-destructive mx-auto" />
            ) : (
              <Clock className="h-16 w-16 text-primary mx-auto animate-pulse" />
            )}
          </div>
          <CardTitle className="text-xl">
            {isRejected ? "KYC Verification Rejected" : "KYC Verification Pending"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRejected ? (
            <>
              <p className="text-muted-foreground">
                Your identity verification was not approved.
              </p>
              {profile?.kyc_rejected_reason && (
                <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
                  <strong>Reason:</strong> {profile.kyc_rejected_reason}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Please contact support or create a new account with valid documentation.
              </p>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">
                Your account has been created successfully. An admin is reviewing your identity documents.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg p-3">
                <ShieldCheck className="h-4 w-4" />
                This usually takes 1-2 business days
              </div>
            </>
          )}
          <Button variant="outline" onClick={() => signOut()} className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
