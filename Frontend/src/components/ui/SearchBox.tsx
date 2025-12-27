import { Search, Check } from "lucide-react";
import "./common.css";
import { jobRoles } from "../../utils/jobRoles";
import { useEffect, useRef, useState } from "react";

interface SearchBoxProps {
  onSelectRole?: (role: string) => void;
}

function SearchBox({ onSelectRole }: SearchBoxProps) {
  const [userInput, setUserInput] = useState<string>("");
  const [jobRoleResult, setJobRoleResult] = useState<string[]>([]);
  const searchCache = useRef<Map<string, string[]>>(new Map());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setJobRoleResult([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Debouncing
  useEffect(() => {
    if (userInput.trim().length === 0) {
      setJobRoleResult([]);
      return;
    }
    // Don't search if user selected an exact match
    if (jobRoles.includes(userInput)) {
      setJobRoleResult([]);
      return;
    }

    const timer = setTimeout(() => {
      const searchKey = userInput.toLowerCase();

      // Search from cache first
      if (searchCache.current.has(searchKey)) {
        setJobRoleResult(searchCache.current.get(searchKey)!);
        return;
      }
      const searchResult = jobRoles.filter((roles) => roles.toLowerCase().includes(searchKey));

      // Store in cache
      searchCache.current.set(searchKey, searchResult);

      setJobRoleResult(searchResult);
    }, 300);

    return () => clearTimeout(timer);
  }, [userInput]);

  // condition for showing result
  const hasSearchResults = userInput.trim().length > 0 && jobRoleResult.length > 0;
  const isExactMatch = jobRoles.includes(userInput);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative mt-2">
        <Search className="text-gray-10 absolute top-1/2 left-2 h-5 w-5 -translate-y-1/2" />

        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Select or type a role (e.g. Full Stack Developer)"
          className="border-gray-8 focus:border-gray-11 w-full rounded-lg border p-2 pl-9 font-medium outline-none placeholder:text-sm placeholder:md:text-[.9rem]"
        />

        {hasSearchResults && (
          <div className="bg-bg-gray-2 border-gray-8 absolute z-999 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border shadow">
            {jobRoleResult.map((searchResult) => {
              return (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserInput(searchResult);
                    setJobRoleResult([]);
                    onSelectRole?.(searchResult);
                  }}
                  className="hover:bg-gray-4 cursor-pointer p-2.5"
                  key={searchResult}
                >
                  {searchResult}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {isExactMatch && userInput.length > 0 && (
        <div className="text-success-text absolute mt-1 ml-1 flex items-center gap-1">
          {" "}
          <Check className="size-4.5" /> <p className="text-sm">Selected: {userInput}</p>
        </div>
      )}
    </div>
  );
}

export default SearchBox;
