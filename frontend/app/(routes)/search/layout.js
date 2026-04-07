import React from "react";
import CategoryList from "./_components/CategoryList";
import SearchContextBar from "./_components/SearchContextBar";

function Layout({ children }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-20">
      <SearchContextBar />

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="h-fit lg:sticky lg:top-24">
          <CategoryList />
        </div>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

export default Layout;

