// app/product-form.tsx
import { useEffect, useState } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Divider,
  IconButton,
  Portal,
  Dialog,
} from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { itemService } from "@/services/itemService";
import { categoryService } from "@/services/categoryService";
import { subcategoryService } from "@/services/subcategoryService";
import PaperDropdown from "@/components/PaperDropdown";

interface Option {
  label: string;
  value: number;
}

interface ItemDetail {
  id: number;
  name: string;
  category_id: number | null;
  subcategory_id: number | null;
}

export default function ProductFormScreen() {
  const { id } = useLocalSearchParams();
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [showCategory, setShowCategory] = useState(false);
  const [showSubcategory, setShowSubcategory] = useState(false);
  const [categoryValue, setCategoryValue] = useState<number | null>(null);
  const [subcategoryValue, setSubcategoryValue] = useState<number | null>(null);
  const [categories, setCategories] = useState<Option[]>([]);
  const [subcategories, setSubcategories] = useState<Option[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const cats = categoryService.getAll() as any[];
    setCategories(cats.map((c) => ({ label: c.name, value: c.id })));

    if (isEdit) {
      const item = itemService.getById(Number(id)) as ItemDetail | null;
      if (item) {
        setName(item.name);
        if (item.category_id) {
          setShowCategory(true);
          setCategoryValue(item.category_id);

          // load subcategories for this category
          const subs = subcategoryService.getByCategory(
            item.category_id,
          ) as any[];
          setSubcategories(subs.map((s) => ({ label: s.name, value: s.id })));
        }
        if (item.subcategory_id) {
          setShowSubcategory(true);
          setSubcategoryValue(item.subcategory_id);
        }
      }
    }
  }, []);

  const handleAddCategory = (newName: string) => {
    const newId = categoryService.create({ name: newName }) as number;
    setCategories((prev) => [...prev, { label: newName, value: newId }]);
    setCategoryValue(newId);
    setSubcategories([]);
    setSubcategoryValue(null);
    setShowSubcategory(false);
  };

  const handleAddSubcategory = (newName: string) => {
    if (!categoryValue) return;
    const newId = subcategoryService.create({
      name: newName,
      category_id: categoryValue,
    }) as number;
    setSubcategories((prev) => [...prev, { label: newName, value: newId }]);
    setSubcategoryValue(newId);
  };

  const handleCategoryChange = (val: number) => {
    setCategoryValue(val);
    setSubcategoryValue(null);
    setShowSubcategory(false);

    // load subcategories for selected category
    const subs = subcategoryService.getByCategory(val) as any[];
    setSubcategories(subs.map((s) => ({ label: s.name, value: s.id })));
  };

  const handleUnselectCategory = () => {
    setCategoryValue(null);
    setShowCategory(false);
    setSubcategoryValue(null);
    setShowSubcategory(false);
    setSubcategories([]);
  };

  const handleUnselectSubcategory = () => {
    setSubcategoryValue(null);
    setShowSubcategory(false);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (isEdit) {
      itemService.update(Number(id), {
        name,
        category_id: categoryValue,
        subcategory_id: subcategoryValue,
      });
    } else {
      itemService.create({
        name,
        category_id: categoryValue,
        subcategory_id: subcategoryValue,
      });
    }
    router.back();
  };

  const handleDelete = () => {
    itemService.delete(Number(id));
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, padding: 24, gap: 16 }}
    >
      <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>
        {isEdit ? "Edit Product" : "Add Product"}
      </Text>
      <Divider />

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
      />

      {/* Category */}
      {!showCategory ? (
        <Button mode="text" onPress={() => setShowCategory(true)}>
          + Add Category
        </Button>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <PaperDropdown
              label="Category"
              value={categoryValue}
              options={categories}
              onChange={handleCategoryChange}
              onAddNew={handleAddCategory}
            />
          </View>
          <IconButton icon="close" size={20} onPress={handleUnselectCategory} />
        </View>
      )}

      {/* Subcategory */}
      {showCategory && !showSubcategory ? (
        <Button mode="text" onPress={() => setShowSubcategory(true)}>
          + Add Subcategory
        </Button>
      ) : showSubcategory ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <PaperDropdown
              label="Subcategory"
              value={subcategoryValue}
              options={subcategories}
              onChange={setSubcategoryValue}
              onAddNew={handleAddSubcategory}
            />
          </View>
          <IconButton
            icon="close"
            size={20}
            onPress={handleUnselectSubcategory}
          />
        </View>
      ) : null}

      <Divider />

      <Button mode="contained" onPress={handleSave}>
        {isEdit ? "Save" : "Add"}
      </Button>

      {isEdit && (
        <Button
          mode="outlined"
          textColor="red"
          onPress={() => setShowDeleteModal(true)}
        >
          Delete
        </Button>
      )}

      <Portal>
        <Dialog
          visible={showDeleteModal}
          onDismiss={() => setShowDeleteModal(false)}
        >
          <Dialog.Title>Delete Product</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete "{name}"?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button textColor="red" onPress={handleDelete}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
}
