// components/ui/PaperDropdown.tsx
import { useState } from "react";
import { View } from "react-native";
import { Menu, TextInput, Divider, Button, Text } from "react-native-paper";

interface Option {
  label: string;
  value: number;
}

interface Props {
  label: string;
  value: number | null;
  options: Option[];
  onChange: (value: number) => void;
  onAddNew: (name: string) => void;
}

export default function PaperDropdown({
  label,
  value,
  options,
  onChange,
  onAddNew,
}: Props) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [showInput, setShowInput] = useState(false);

  const selected = options.find((o) => o.value === value);

  const handleAddNew = () => {
    if (!newName.trim()) return;
    onAddNew(newName.trim());
    setNewName("");
    setShowInput(false);
    setOpen(false);
  };

  return (
    <View>
      <Menu
        visible={open}
        onDismiss={() => {
          setOpen(false);
          setShowInput(false);
        }}
        anchor={
          <TextInput
            label={label}
            value={selected?.label ?? ""}
            mode="outlined"
            editable={false}
            right={
              <TextInput.Icon
                icon="chevron-down"
                onPress={() => setOpen(true)}
              />
            }
            onPressIn={() => setOpen(true)}
          />
        }
      >
        {options.map((opt) => (
          <Menu.Item
            key={opt.value}
            title={opt.label}
            onPress={() => {
              onChange(opt.value);
              setOpen(false);
            }}
          />
        ))}

        <Divider />

        {!showInput ? (
          <Menu.Item title="+ Add New" onPress={() => setShowInput(true)} />
        ) : (
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              gap: 8,
              minWidth: 250,
            }}
          >
            <TextInput
              label={`New ${label}`}
              value={newName}
              onChangeText={setNewName}
              mode="outlined"
              dense
              autoFocus
              style={{ backgroundColor: "white" }}
            />
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                justifyContent: "flex-end",
              }}
            >
              <Button
                mode="text"
                compact
                onPress={() => {
                  setShowInput(false);
                  setNewName("");
                }}
              >
                Cancel
              </Button>
              <Button mode="contained" compact onPress={handleAddNew}>
                Add
              </Button>
            </View>
          </View>
        )}
      </Menu>
    </View>
  );
}
