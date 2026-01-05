import Link from "next/link";

const ScanButton = () => {
  return (
    <Link
      href="admin/scan"
      className=" inline-flex items-center gap-2rounded-xl border rounded-full border-blue-400 bg-blue-500/10 px-5 py-2text-sm font-semibold text-blue-400 hover:bg-blue-500 hover:text-black  transition-all"
    > Scan Attendance</Link>
  );
};

export default ScanButton;
