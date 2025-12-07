import "./globals.css";

export const metadata = {
  title: "CyberSafe Quiz",
  description: "Cyber Security Awareness Test for students"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}


