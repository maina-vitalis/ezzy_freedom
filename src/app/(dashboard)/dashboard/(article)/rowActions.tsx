import { SquarePen, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import LoadingButton from "@/components/LoadingButton";
import Link from "next/link";

interface ActionsDropdownProps {
  id: string;
}

export function ActionsDropdown({ id }: ActionsDropdownProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (articleId: string) => {
      const response = await axios.delete(`/api/articles/${articleId}`); // Updated endpoint
      return response;
    },
    onSuccess: () => {
      toast.success("Article deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
              }}
              className="text-red-500"
              asChild
            >
              <LoadingButton
                loading={mutation.isPending}
                variant={"ghost"}
                className="w-full"
              >
                <p>Delete</p>
                <Trash size={14} />
              </LoadingButton>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                article.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 text-white"
                onClick={() => mutation.mutate(id)}
                asChild
              >
                <LoadingButton loading={mutation.isPending}>
                  Delete
                </LoadingButton>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DropdownMenuItem asChild className="hover:bg-primary/30">
          <Link
            href={`/dashboard/update-article/${id}`} // Updated route
            className="flex w-full items-center justify-center"
          >
            <p>Edit</p>
            <SquarePen size={15} />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
