import { createStackNavigator } from "@react-navigation/stack";
import HomeRoutes from "./Index";
import AuthScreen from "../screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { useUserContext } from "../Providers/AuthContext";
import Login from "../screens/LoginScreen";
import SignUp from "../screens/SignupScreen";
import useOwnNavigation from "../Hooks/useOwnNav";

const { Navigator, Screen } = createStackNavigator();

const AppRoutes: React.FC = () => {
  const noHeader = { headerShown: false };
  const { user } = useUserContext();
  const { navigate } = useOwnNavigation(); // Using your custom navigation hook

  return (

      <Navigator id={undefined}>
        {!user ? (
          <>
            <Screen name="Login" component={Login} />
            <Screen name="SignUp" component={SignUp} />
          </>
        ) : (
          <Screen name="HomeRoutes" component={HomeRoutes} />
        )}
      </Navigator>

  );
};

export default AppRoutes;