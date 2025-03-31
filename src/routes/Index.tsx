import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import CalendarScreen from "../screens/CalendarScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NewPostScreen from "../screens/NewPostScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faCalendar, faPlus, faPerson } from "@fortawesome/free-solid-svg-icons";

const Tab = createBottomTabNavigator();

const HomeRoutes: React.FC = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let iconName = faHome;
          if (route.name === "Home") {
            iconName = faHome;
          } else if (route.name === "Calendar") {
            iconName = faCalendar;
          } else if (route.name === "NewPost") {
            iconName = faPlus;
          } else if (route.name === "Profile") {
            iconName = faPerson;
          }
          return <FontAwesomeIcon icon={iconName} size={20} color={focused ? "#6200ee" : "#222"} />;
        },
      })}
      initialRouteName="Home"
      id={undefined}
    >
      <Tab.Screen name="Home"  component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="NewPost" component={NewPostScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default HomeRoutes;
