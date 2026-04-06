
export const NavUserSkeleton = () => {
  return (
    <div className="flex h-12 items-center space-x-4 p-2">
      <div className="h-8 w-8 animate-pulse rounded-lg bg-sidebar-accent" />
      <div className="space-y-2">
        <div className="h-3 w-20 animate-pulse rounded bg-sidebar-accent" />
        <div className="h-3 w-24 animate-pulse rounded bg-sidebar-accent" />
      </div>
    </div>
  );
};
