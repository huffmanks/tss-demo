"use client";

import { useState } from "react";

import { Check, ChevronsUpDown, Inbox, Plus } from "lucide-react";

import type { Category, Cuisine, Tag } from "@/db/schema/recipes";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ComboboxMultiSelectProps {
  singularLabel: string;
  pluralLabel: string;
  items: Array<Category> | Array<Cuisine> | Array<Tag> | [];
  formComponent: React.ReactNode;
}

export default function ComboboxMultiSelect({
  singularLabel,
  pluralLabel,
  items = [],
  formComponent,
}: ComboboxMultiSelectProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState("");

  function handleClose() {
    setDialogOpen(false);
  }

  return (
    <>
      <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={popoverOpen}
            className="w-[250px] justify-between"
            role="combobox"
            variant="outline">
            {value || "Select item..."}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search items..." />
            <CommandList>
              {items.length === 0 ? (
                <div className="flex flex-col items-center gap-3 p-6 text-center">
                  <Inbox className="text-muted-foreground size-12" />
                  <div>
                    <p className="text-sm font-medium">No {pluralLabel} yet</p>
                    <p className="text-muted-foreground text-xs">
                      Get started by creating your first item
                    </p>
                  </div>
                  <Button className="w-full" onClick={() => setDialogOpen(true)} size="sm">
                    <Plus className="mr-2 size-4" />
                    Create
                  </Button>
                </div>
              ) : (
                <>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {items.length > 0 &&
                      items.map((item) => (
                        <CommandItem
                          key={item.id}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue);
                            setPopoverOpen(false);
                          }}
                          value={item.id}>
                          <Check
                            className={cn(
                              "mr-2 size-4",
                              value === item.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {item.title}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{singularLabel}</DialogTitle>
            <DialogDescription>
              Create a new <span className="lowercase">{singularLabel}</span>.
            </DialogDescription>
          </DialogHeader>
          {formComponent}
        </DialogContent>
      </Dialog>
    </>
  );
}
