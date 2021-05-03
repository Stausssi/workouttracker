import {Route, RouteProps} from 'react-router';

export type ProtectedRouteProps = {
    /*
    /Specify a bool function that determines the rendered result.
    /True: Return a Route with the specified props
    /False: Returns a redirect to "redirectPath"
     */
    AuthenticationFunction(): boolean;

    // The path to be redirect to
    redirectPath: string;
} & RouteProps;

// This component is used to protect a route from unwanted access
export default function ProtectedRoute({
                                           AuthenticationFunction: isAuthorized,
                                           redirectPath: redirect,
                                           ...otherProps
                                       }: ProtectedRouteProps) {
    if (isAuthorized()) {
        return <Route {...otherProps} />;
    } else {
        // Remove component from props to prevent warnings
        delete otherProps.component;
        return (
            <Route {...otherProps}>
                <Redirect to={redirect}/>
            </Route>
        )
    }
}
