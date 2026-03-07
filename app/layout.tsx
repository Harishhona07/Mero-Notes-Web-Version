import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotesProvider } from "@/contexts/NotesContext";

export const metadata: Metadata = {
  title: "Mero Notes",
  description: "Simple, elegant note-taking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInitScript = `
    (function () {
      try {
        var stored = localStorage.getItem('theme_preference');
        var isDark =
          stored === 'dark' ||
          (!stored && true) ||
          (stored === 'device' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        document.documentElement.classList.add('dark');
      }
    })();
  `;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <NotesProvider>
              {children}
            </NotesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
