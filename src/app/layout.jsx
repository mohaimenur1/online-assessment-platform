import "@/styles/globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "assess — Online Assessment Platform",
  description: "Create and manage online assessments with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
