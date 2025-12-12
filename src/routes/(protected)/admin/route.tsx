import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/admin")({
  component: RouteComponent,
  loader: async ({ location }) => {
    // TODO
    // if not logged in or admin
    // const { user, orgId } = await authUser();
    // if (!user.id) {
    //   throw redirect({
    //     to: "/login",
    //     search: { redirect: location.href },
    //   });
    // }
    // return { user, orgId };
  },
});

function RouteComponent() {
  return (
    <div className="mx-auto max-w-xl p-8">
      <div>Admin layout</div>
      <Outlet />
    </div>
  );
}
