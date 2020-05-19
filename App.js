import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import tempData from "./tempData";
import Swipeable from "react-native-gesture-handler/Swipeable";
import colors from "./Colors";

const LeftActions = (progress, dragX) => {
  const scale = dragX.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  return (
    <Animated.View style={styles.leftActions}>
      <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
        Add to Cart
      </Animated.Text>
    </Animated.View>
  );
};
const RightActions = ({ progress, dragX, onPress }) => {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const opacity = dragX.interpolate({
    inputRange: [-100, -20, 0],
    outputRange: [1, 0.9, 0],
    extrapolate: "clamp",
  });
  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View style={[styles.rightActions, { opacity: opacity }]}>
        <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
          Delete
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

function Item({ title, thumbnail, onSwipeFromLeft, onRightPress }) {
  console.log(thumbnail);
  return (
    <Swipeable
      onSwipeableLeftOpen={onSwipeFromLeft}
      renderLeftActions={(progress, dragX) => LeftActions(progress, dragX)}
      renderRightActions={(progress, dragX) => (
        <RightActions
          progress={progress}
          dragX={dragX}
          onPress={onRightPress}
        />
      )}
    >
      <View style={styles.item}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: thumbnail,
            }}
          />
          <Text style={styles.title}>{title}</Text>
      </View>
    </Swipeable>
  );
}

export default function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setData(json);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={isVisible}
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <SafeAreaView style={styles.container}>
              <FlatList
                data={data}
                renderItem={({ item }) => (
                  <Item
                    title={item.title}
                    thumbnail={item.thumbnailUrl}
                    onSwipeFromLeft={() => alert("Swipe from left")}
                    onRightPress={() => {
                      alert("pressed right");
                    }}
                  />
                )}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: colors.lightGray,
                      flex: 1,
                    }}
                  ></View>
                )}
                keyExtractor={(item) => item.id}
              />
            </SafeAreaView>
          </View>
        </View>
      </Modal>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <Item
              title={item.title}
              thumbnail={item.thumbnailUrl}
              onSwipeFromLeft={() => alert("Swipe from left")}
              onRightPress={() => {
                alert("pressed right");
              }}
            />
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: colors.lightGray,
                flex: 1,
              }}
            ></View>
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
      <TouchableOpacity style={styles.create} onPress={toggleModal}>
        <Text style={{ color: colors.white, fontWeight: "600" }}>
          Open Modal!
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    marginTop: 32,
  },
  borderView: {
    borderWidth: 1,
    borderColor: colors.red,
  },
  item: {
    backgroundColor: colors.white,
    padding: 20,
    flexDirection:"row"
  },
  title: {
    fontSize: 18,
    paddingRight: 32,
  },
  leftActions: {
    backgroundColor: colors.green,
    justifyContent: "center",
    flex: 1,
  },
  rightActions: {
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  actionText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 20,
    padding: 20,
  },
  create: {
    backgroundColor: colors.blue,
    marginHorizontal: 20,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  tinyLogo: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight:10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
