import { Search } from "lucide-react";

function SearchBox() {
  return (
    <div className="relative mt-2">
      <Search className="text-gray-10 absolute top-1/2 left-2 h-5 w-5 -translate-y-1/2" />
      <input
        placeholder="Select or type a role (e.g. Full Stack Developer)"
        type="text"
        className="border-gray-8 focus:border-gray-11 relative w-full rounded-lg border p-2 pl-9 font-medium outline-none placeholder:text-sm placeholder:md:text-[1rem]"
      />
    </div>
  );
}

export default SearchBox;
