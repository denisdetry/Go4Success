import { StyleSheet } from "react-native";

export default StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  mainContainer: {
    flex: 1,
    alignSelf: "center",
    gap: 10,
    justifyContent: "center",
    marginTop: 70,
    margin: 40,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    paddingHorizontal: 14,
    borderBlockColor: "#777",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    color: "#333",
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
    borderColor: "#777",
    padding: 8,
    margin: 10,
  },
  icon: {
    marginLeft: 10,
  },
  heading: {
    alignItems: "center",
    fontSize: 20,
    color: "green",
    marginBottom: 20,
  },
});
