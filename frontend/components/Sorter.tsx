import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type SortOrder = "newest" | "oldest";

type SorterProps = {
  value: SortOrder;
  onChange: (order: SortOrder) => void;
};

const Sorter: React.FC<SorterProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (order: SortOrder) => {
    onChange(order);
    setOpen(false);
  };

  const label = value === "newest" ? "Newest" : "Oldest";

  return (
    <View style={styles.container}>
      {/* Trigger */}
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen((prev) => !prev)}
        activeOpacity={0.7}
      >
        <Text style={styles.triggerText}>Date: {label}</Text>

        {/* Arrow */}
        <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {/* Dropdown options (NO "Date:" here) */}
      {open && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleSelect("newest")}
          >
            <Text style={styles.optionText}>Newest</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => handleSelect("oldest")}
          >
            <Text style={styles.optionText}>Oldest</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Sorter;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignSelf: "flex-start",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 140,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  triggerText: {
    fontSize: 14,
    color: "#111827",
  },
  arrow: {
    marginLeft: 8,
    fontSize: 12,
    color: "#111827",
  },
  dropdown: {
    position: "absolute",
    top: 44,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    zIndex: 100,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 14,
    color: "#111827",
  },
});
