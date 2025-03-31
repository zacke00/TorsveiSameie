import { createStackNavigator } from "@react-navigation/stack";
import HomeRoutes from "./Index";
import { useUserContext } from "../Providers/AuthContext";
import Login from "../screens/LoginScreen";
import SignUp from "../screens/SignupScreen";
import PostDetailScreen from "../screens/PostDetailScreen";


const { Navigator, Screen } = createStackNavigator();

const AppRoutes: React.FC = () => {
  const { user } = useUserContext();

  return (
    
      <Navigator id={undefined} screenOptions={{ headerShown: false}}>
        {!user ? (
          <>
            <Screen name="Login" component={Login}  />
            <Screen name="SignUp" component={SignUp} />
          </>
        ) : (
          <>
            <Screen name="HomeRoutes" component={HomeRoutes} />
            <Screen name="PostDetail" component={PostDetailScreen} />
          </>
          )}
      </Navigator>

  );
};

export default AppRoutes;