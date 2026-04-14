'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useActiveBranches } from '@/api/branches/queries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';
import { useBranchContext } from '@/providers/branch-provider';

export const GlobalBranchSwitcher = () => {
  const { data: branches, isLoading } = useActiveBranches();
  const { currentBranchId, setBranchId } = useBranchContext();
  const pathname = usePathname();

  const pathSegments = pathname.split('/').filter(Boolean);
  
  const isDeepRoute = pathSegments.length > 1;

useEffect(() => {
    if (!isLoading && branches && branches.length > 0) {
      const isCurrentBranchValid = branches.some(branch => branch.id === currentBranchId);

      if (!currentBranchId || !isCurrentBranchValid) {
        setBranchId(branches[0].id);
      }
    }
  }, [isLoading, branches, currentBranchId, setBranchId]);

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <Building2 className="w-5 h-5 text-muted-foreground" />
      <Select 
        value={currentBranchId || ''} 
        onValueChange={setBranchId}
        disabled={isLoading || !branches?.length || isDeepRoute}
      >
        <SelectTrigger 
          className="w-[250px] border-none bg-accent/50 focus:ring-0 disabled:opacity-50"
        >
          <SelectValue placeholder="Select branch..." />
        </SelectTrigger>
        <SelectContent>
          {branches?.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};