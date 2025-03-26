import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import HomeRoutes from "./Index";
import { useUserContext } from "../Providers/AuthContext";
import Login from "../screens/LoginScreen";
import SignUp from "../screens/SignupScreen";
import CalendarScreen from "../screens/CalendarScreen";
import AddEventScreen from "../screens/AddEventScreen";


const { Navigator, Screen } = createStackNavigator();

const AppRoutes: React.FC = () => {
  const { user } = useUserContext();

  return (
    
      <Navigator id={undefined} screenOptions={{ headerShown: false}}>
        {!user ? (
          <>
            <Screen name="Login" component={Login} />
            <Screen name="SignUp" component={SignUp} />
          </>
        ) : (
          <Screen name="HomeRoutes" component={HomeRoutes} />
          )}
      <Screen name="Calendar" component={CalendarScreen} />
      <Screen name="AddEvent" component={AddEventScreen} />
      </Navigator>

  );
};

export default AppRoutes;