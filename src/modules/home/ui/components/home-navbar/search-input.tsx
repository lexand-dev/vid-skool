import { SearchIcon } from "lucide-react";

export const SearchInput = () => {
  return (
    <form className="flex w-full max-w-[600px]">
      {/* TODO: add search funcionality */}

      <input
        type="text"
        placeholder="Search for courses, lessons, teachers..."
        className="w-full pl-4 pr-12 py-2 rounded-l-full border focus:outline-none focus:border-blue-500"
      />
      {/* TODO: Add remove search button */}

      <button
        type="button"
        className="px-5 bg-gray-100 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SearchIcon className="size-5" />
      </button>
    </form>
  );
};
