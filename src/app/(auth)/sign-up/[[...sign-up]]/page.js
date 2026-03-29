import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <h2 className="mt-6 text-center font-serif text-3xl font-medium tracking-tight text-foreground">
            Join the Santiago Bros Collection
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Create an account to save your favorite luxury pieces
          </p>
        </div>
        <div className="mt-10 flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-4 rounded-md transition-all",
                card: "shadow-none border border-border rounded-xl bg-white",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-border hover:bg-secondary/50",
                footerActionLink: "text-primary hover:text-primary/80 font-medium"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
