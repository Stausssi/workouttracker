import { Redirect, Route, RouteProps } from 'react-router';

export type ProtectedRouteProps = {
    AuthenticationFunction():Boolean;
    /*
    /Specify a bool function that determines the rendered result.
    /True: Return a Route with the specified props
    /False: Returns a redirect to "redirectPath"
     */
    redirectPath: string | null;
    /*
    /Redirect Path
     */
} & RouteProps;

export default function ProtectedRoute({AuthenticationFunction, redirectPath, ...routeProps}: ProtectedRouteProps) {
    /*
    / This component can be used to protect a route, based on a given "AuthenticationFunction" a Route with a given component is rendered
    / or the user is redirected
     */
    if(AuthenticationFunction()) {
        return <Route {...routeProps} />;
    } else if(redirectPath != null) {
        //return <Redirect to={{ pathname: redirectPath }} />;
    }
    return null;
};