import { Search, Check } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { jobRoles } from "../../utils/jobRoles";
import "./common.css";

type SearchBoxProps = {
  onSelectRole?: (role: string | null) => void;
};

function SearchBox({ onSelectRole }: SearchBoxProps) {
  const [input, setInput] = useState<string>("");
  const [filteredRoles, setFilteredRoles] = useState<string[]>([]);
  const [showJobRole, setShowJobRole] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isSearching, setIsSearching] = useState(false);

  const cacheRef = useRef<Map<string, string[]>>(new Map());

  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleKeyEvents = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showJobRole || filteredRoles.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < filteredRoles.length - 1 ? prev + 1 : 0));
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredRoles.length - 1));
        break;

      case "Enter":
        if (activeIndex >= 0) {
          handleSelectRole(filteredRoles[activeIndex]);
        }
        break;

      case "Escape":
        setShowJobRole(false);
        break;
    }
  };

  useEffect(() => {
    if (!input.trim()) {
      onSelectRole?.(null);
    }
  }, [input]);

  useEffect(() => {
    if (activeIndex < 0) return;

    const activeItem = itemRefs.current[activeIndex];
    if (activeItem) {
      activeItem.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    if (selectedRole && input !== selectedRole) {
      setSelectedRole(null);
    }
  }, [input, selectedRole]);

  useEffect(() => {
    if (!input.trim()) {
      setFilteredRoles([]);
      setActiveIndex(-1);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    // debouncing
    const timer = setTimeout(() => {
      const query = input.toLowerCase();

      // Check cache
      if (cacheRef.current.has(query)) {
        setFilteredRoles(cacheRef.current.get(query)!);
        setActiveIndex(-1);
        setIsSearching(false);
        return;
      }

      // Compute + cache
      const results = jobRoles.filter((role) => role.toLowerCase().includes(query));

      const finalResults = results.length === 0 ? [input] : results;

      cacheRef.current.set(query, finalResults);
      setFilteredRoles(finalResults);
      setActiveIndex(-1);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  const handleSelectRole = (role: string) => {
    setInput(role);
    setSelectedRole(role);
    setShowJobRole(false);
    onSelectRole?.(role);
  };

  const shouldShowDropdown =
    showJobRole && !isSearching && input.length > 0 && filteredRoles.length > 0;

  return (
    <div className="relative">
      <div className="relative mt-2">
        <Search className="text-gray-10 absolute top-1/2 left-2 h-5 w-5 -translate-y-1/2" />
        <input
          placeholder="Select or type a role (e.g. Full Stack Developer)"
          type="text"
          value={input}
          onFocus={() => setShowJobRole(true)}
          onBlur={() => setShowJobRole(false)}
          onKeyDown={handleKeyEvents}
          onChange={(e) => setInput(e?.target.value)}
          className="border-gray-8 focus:border-gray-11 relative w-full rounded-lg border p-2 pl-9 font-medium outline-none placeholder:text-sm placeholder:md:text-[.9rem]"
        />
        <div className="relative">
          {shouldShowDropdown && (
            <div
              ref={listRef}
              className="bg-bg-gray-2 border-gray-8 absolute right-0 left-0 z-999 mx-auto mt-3 max-h-60 overflow-y-scroll rounded-xl border"
            >
              {filteredRoles.map((jobRole, index) => {
                const isCustom = !jobRoles.includes(jobRole);
                return (
                  <div
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    className={`border-b border-gray-200 px-3 py-2 transition-colors last:border-b-0 ${
                      index === activeIndex ? "bg-gray-4" : "hover:bg-gray-4"
                    }`}
                    key={index}
                    onMouseDown={() => handleSelectRole(jobRole)}
                  >
                    {isCustom && <span className="text-xs text-gray-500">Add </span>}
                    {jobRole}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {selectedRole && (
        <div className="mt-2 flex items-center justify-start gap-1 text-green-600">
          <Check className="text-success-text size-4" />{" "}
          <p className="text-sm">Selected: {selectedRole}</p>
        </div>
      )}
    </div>
  );
}

export default SearchBox;
