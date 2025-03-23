import { View, Text, Button } from 'react-native';
import { useUserContext } from '../Providers/AuthContext'; // Import the hook

export default function HomeScreen() {
  const { user, setCurrentUser } = useUserContext();

  const handleSignOut = () => {
    setCurrentUser(null);  // This will set the user to null and log them out
  };

  return (
    <View>
      <Text>Welcome, {user ? user.displayName : 'Guest'}</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}
