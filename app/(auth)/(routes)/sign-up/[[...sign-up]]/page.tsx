import { SignUp } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";

export default function Page() {
  return <SignUp routing="hash" appearance={{ baseTheme: dark }} />;
}
