import { Providers } from "../providers";

const SetupLayout = ({ children }: { children: React.ReactNode }) => {
  return <Providers>{children}</Providers>;
};

export default SetupLayout;
