import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import Animated, {
  LinearTransition,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type Song = {
  id: string;
  title: string;
  completed?: boolean;
};

export default function Songs() {
  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;

  const [songTitle, setSongTitle] = useState("");
  const [songList, setSongList] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const width = useSharedValue(20);

  const handleIncreaseWidth = () => {
    width.value = withSpring(width.value + 20);
  };

  const addSong = (song: Song) => {
    const exists = songList.find((s) => s.title.trim() === song.id.trim());

    if (exists) {
      console.log("Song already exists");
      return;
    }

    setSongList((prev) => [...prev, song]);
    setSongTitle("");
  };

  const removeSong = (song: Song) => {
    setSongList((prev) => prev.filter((s) => s.id !== song.id));
  };

  const handleEditSong = (song: Song) => {
    const updatedSongList = songList.map((s) => {
      if (s.id === song.id) {
        return { ...s, title: song.title };
      }
      return s;
    });
    setSongList(updatedSongList);
  };

  const handleToggleComplete = (song: Song) => {
    const updatedSongList = songList.map((s) => {
      if (s.id === song.id) {
        return { ...s, completed: !s.completed };
      }
      return s;
    });
    setSongList(updatedSongList);
  };

  const storeData = async () => {
    try {
      const jsonValue = JSON.stringify(songList);
      await AsyncStorage.setItem("songs", jsonValue);
    } catch (e) {
      console.log("Error storing data", e);
    }
  };

  const getData = async () => {
    setLoading(true);

    try {
      const jsonValue = await AsyncStorage.getItem("songs");
      if (jsonValue !== null) setSongList(JSON.parse(jsonValue));
    } catch (e) {
      console.log("Error getting data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    storeData();
  }, [songList]);

  return (
    <Container className="bg-light dark:bg-dark dark:text-darkText text-light flex-1">
      <View className="p-4">
        <View className="flex flex-row items-center justify-between">
          <View>
            <Text className="dark:text-gray-300">Hello,</Text>
            <ThemedText
              className="font-extrabold mt-1"
              style={{ fontSize: 20 }}
            >
              Hi Benjamin,
            </ThemedText>
          </View>

          <View className="size-16 rounded-full">
            <Image
              source={require("@/assets/images/profile-circle.png")}
              className="rounded-full size-16"
            ></Image>
          </View>
        </View>

        <View className="mt-8">
          <View className="flex flex-row items-center justify-between gap-4">
            <TextInput
              className="bg-gray-200 dark:bg-gray-700 dark:text-gray-300 text-gray-900 rounded-full p-4 flex-grow"
              placeholder="Add a song..."
              value={songTitle}
              onChangeText={setSongTitle}
            />

            <Pressable
              onPress={() => {
                if (songTitle.trim() === "") {
                  console.log("Empty song title");
                  return;
                }

                addSong({ id: songTitle, title: songTitle });
              }}
            >
              <IconSymbol size={28} name="paperplane.fill" color={"#fff"} />
            </Pressable>
          </View>

          <View>
            {songList.length > 0 ? (
              <Animated.FlatList
                data={songList}
                keyExtractor={(item) => item.id}
                itemLayoutAnimation={LinearTransition}
                renderItem={({ item }) => (
                  <Todo
                    todo={item}
                    onRemove={removeSong}
                    onEdit={handleEditSong}
                    onCompleteToggle={handleToggleComplete}
                  />
                )}
                keyboardDismissMode="on-drag"
                // scrollEnabled={false}
              />
            ) : (
              <View className="p-10 text-center text-sm w-full dark:text-gray-700 flex items-center justify-center">
                <ThemedText className="text-gray-400 dark:text-gray-500">
                  No songs added yet.
                </ThemedText>
                <ThemedText className="text-gray-400 dark:text-gray-500">
                  Add a song to get started.
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <View className="mt-8 flex items-center justify-center">
          <Animated.View
            style={{ width }}
            className="bg-red-500 h-10 rounded-md"
          />

          <Button onPress={handleIncreaseWidth} title="Click me" />
        </View>
      </View>
    </Container>
  );
}

type TodoProps = {
  todo: Song;
  onRemove: (todo: Song) => void;
  onEdit: (todo: Song) => void;
  onCompleteToggle: (todo: Song) => void;
};

const Todo = ({ todo, onRemove, onEdit, onCompleteToggle }: TodoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const router = useRouter();

  const handleEdit = () => {
    if (editedTitle.trim() === "") {
      console.log("Empty song title");
      return;
    }

    onEdit({ ...todo, title: editedTitle });
    setIsEditing(false);
  };

  return (
    <Animated.View className="flex flex-row items-center justify-between mt-4 bg-gray-200 dark:bg-gray-700 flex-wrap dark:text-gray-300 text-gray-900 rounded-md p-4">
      {!isEditing ? (
        <>
          <View className="flex flex-row items-center gap-2">
            <Pressable onPress={() => onCompleteToggle(todo)}>
              {!todo.completed ? (
                <Fontisto name="checkbox-passive" size={20} color="white" />
              ) : (
                <Fontisto name="checkbox-active" size={20} color="white" />
              )}
            </Pressable>
            <ThemedText
              className={todo.completed ? "line-through opacity-60" : ""}
            >
              {todo.title}
            </ThemedText>
          </View>
          <View className="flex flex-row gap-2">
            <Pressable
              onPress={() =>
                router.navigate({
                  pathname: "/songs/[id]",
                  params: { id: todo.id },
                })
              }
            >
              <IconSymbol size={20} name="pencil" color={"#fff"} />
            </Pressable>

            <Pressable onPress={() => onRemove(todo)}>
              <IconSymbol size={20} name="trash" color={"#fff"} />
            </Pressable>
          </View>
        </>
      ) : (
        <View className="flex flex-row gap-2">
          <TextInput
            className="bg-gray-200 dark:bg-gray-700 dark:text-gray-300 text-gray-900 p-2 dark:border-gray-400 flex-grow border-b "
            value={editedTitle}
            onChangeText={setEditedTitle}
            placeholder="Edit song title..."
            autoFocus
          />

          <Pressable onPress={handleEdit}>
            <IconSymbol size={28} name="paperplane.fill" color={"#fff"} />
          </Pressable>

          <Pressable onPress={() => setIsEditing(false)}>
            <IconSymbol size={28} name="x.circle" color={"#fff"} />
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
};
