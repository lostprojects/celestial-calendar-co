import { useForm } from "react-hook-form";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "components/ui/use-toast";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "components/ui/form";

type ProfileFormValues = {
  full_name: string;
};

export function AccountDetails({ userId, initialData }: { userId: string, initialData: ProfileFormValues }) {
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    defaultValues: initialData,
  });

  const onSubmit = async (values: ProfileFormValues) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: values.full_name,
      })
      .eq("id", userId);

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-serif mb-2">My Details</h1>
        <p className="text-sm text-muted-foreground">
          Update your personal information.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel className="text-base">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter your full name"
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit"
            className="h-12 px-6 bg-[#403E43] hover:bg-[#403E43]/90"
          >
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
