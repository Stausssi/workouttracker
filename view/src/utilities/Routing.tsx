import {Route, RouteProps} from 'react-router';

export type ProtectedRouteProps = {
    AuthenticationFunction(): Boolean;
    /*
    /Specify a bool function that determines the rendered result.
    /True: Return a Route with the specified props
    /False: Returns a redirect to "redirectPath"
     */
} & RouteProps;

export default function ProtectedRoute({AuthenticationFunction, ...routeProps}: ProtectedRouteProps ) {
    /*
    / This component can be used to protect a route, based on a given "AuthenticationFunction" a Route with a given component is rendered
     */
    if (AuthenticationFunction()) {
        return <Route {...routeProps} />;
    } else {
        return null;
    }
};