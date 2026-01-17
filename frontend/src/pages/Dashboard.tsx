import { useState } from "react";
import Layout from "../components/layout/Layout";
import EmailList from "../components/email/EmailList";
import ComposeModal from "../components/email/ComposeModal";

export default function Dashboard() {
  const [folder, setFolder] = useState<"scheduled" | "sent">("scheduled");
  const [open, setOpen] = useState(false);

  return (
    <Layout
      folder={folder}
      onFolderChange={setFolder}
      onCompose={() => setOpen(true)}
    >
      <EmailList type={folder} />
      <ComposeModal open={open} onClose={() => setOpen(false)} />
    </Layout>
  );
}
