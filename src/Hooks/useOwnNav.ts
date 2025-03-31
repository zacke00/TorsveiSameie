import { useNavigation, NavigationProp } from "@react-navigation/native";

type RouteList = {
    UpdateProfile: undefined;
    Profile: undefined;
    Home: undefined;
    Calendar: undefined;
    Login: undefined;
    SignUp: undefined;
    PostDetail: { postId: string };
    HomeRoutes: undefined;
};

type SolarNavigationProps = NavigationProp<RouteList>;

const useOwnNavigation = () => {
  const navigation = useNavigation<SolarNavigationProps>();

  const navigate = (path: keyof RouteList, params?: any) => {
    navigation.navigate(path, params);
  };

  const goBack = () => {
    navigation.goBack();
  };

  return { navigate, goBack };
};

export default useOwnNavigation;
