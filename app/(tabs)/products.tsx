// app/(tabs)/products.tsx
import { useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, ScrollView } from "react-native";
import {
  Text,
  Divider,
  FAB,
  Chip,
  Portal,
  Dialog,
  Button,
  IconButton,
} from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import { itemService } from "@/services/itemService";
import { categoryService } from "@/services/categoryService";
import { subcategoryService } from "@/services/subcategoryService";

interface Item {
  id: number;
  name: string;
  category_id: number | null;
  category_name: string | null;
  subcategory_id: number | null;
  subcategory_name: string | null;
}

interface Option {
  id: number;
  name: string;
}

export default function ProductsScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [subcategories, setSubcategories] = useState<Option[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(
    null,
  );

  // manage modal
  const [showManage, setShowManage] = useState(false);
  const [manageCategories, setManageCategories] = useState<Option[]>([]);
  const [manageSubcategories, setManageSubcategories] = useState<Option[]>([]);
  const [manageSelectedCategory, setManageSelectedCategory] = useState<
    number | null
  >(null);

  // delete confirm
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
    type: "category" | "subcategory";
  } | null>(null);

  const loadData = () => {
    setItems(itemService.getAll() as Item[]);
    setCategories(categoryService.getAll() as Option[]);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSubcategories([]);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const openManage = () => {
    const cats = categoryService.getAll() as Option[];
    setManageCategories(cats);
    setManageSelectedCategory(null);
    setManageSubcategories([]);
    setShowManage(true);
  };

  const closeManage = () => {
    setShowManage(false);
    setManageSelectedCategory(null);
    setManageSubcategories([]);
  };

  const handleCategoryFilter = (catId: number) => {
    if (selectedCategory === catId) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSubcategories([]);
      return;
    }
    setSelectedCategory(catId);
    setSelectedSubcategory(null);
    setSubcategories(subcategoryService.getByCategory(catId) as Option[]);
  };

  const handleSubcategoryFilter = (subId: number) => {
    setSelectedSubcategory(selectedSubcategory === subId ? null : subId);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSubcategories([]);
  };

  const handleManageCategoryPress = (catId: number) => {
    if (manageSelectedCategory === catId) {
      setManageSelectedCategory(null);
      setManageSubcategories([]);
      return;
    }
    setManageSelectedCategory(catId);
    setManageSubcategories(subcategoryService.getByCategory(catId) as Option[]);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "category") {
      const subs = subcategoryService.getByCategory(
        deleteTarget.id,
      ) as Option[];
      subs.forEach((sub) => subcategoryService.delete(sub.id));
      categoryService.delete(deleteTarget.id);

      if (manageSelectedCategory === deleteTarget.id) {
        setManageSelectedCategory(null);
        setManageSubcategories([]);
      }
    } else {
      subcategoryService.delete(deleteTarget.id);
      if (manageSelectedCategory) {
        setManageSubcategories(
          subcategoryService.getByCategory(manageSelectedCategory) as Option[],
        );
      }
    }

    setDeleteTarget(null);
    const refreshed = categoryService.getAll() as Option[];
    setManageCategories(refreshed);
    setCategories(refreshed);
    setItems(itemService.getAll() as Item[]);
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory) {
      if (item.category_id !== selectedCategory) return false;
      if (selectedSubcategory)
        return item.subcategory_id === selectedSubcategory;
    }
    return true;
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Category Filter */}
      <View style={{ padding: 12, gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              {categories.map((cat) => (
                <Chip
                  key={cat.id}
                  selected={selectedCategory === cat.id}
                  onPress={() => handleCategoryFilter(cat.id)}
                  mode="outlined"
                >
                  {cat.name}
                </Chip>
              ))}
              {selectedCategory && (
                <Chip icon="close" onPress={handleClearFilters} mode="flat">
                  Clear
                </Chip>
              )}
            </View>
          </ScrollView>
          <IconButton icon="cog" size={20} onPress={openManage} />
        </View>

        {selectedCategory && subcategories.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {subcategories.map((sub) => (
                <Chip
                  key={sub.id}
                  selected={selectedSubcategory === sub.id}
                  onPress={() => handleSubcategoryFilter(sub.id)}
                  mode="outlined"
                >
                  {sub.name}
                </Chip>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <Divider />

      {/* Items List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ paddingVertical: 14 }}
            onPress={() => router.push(`/product-form?id=${item.id}`)}
          >
            <Text variant="bodyLarge">{item.name}</Text>
            <Text variant="bodySmall" style={{ color: "gray" }}>
              {item.category_name
                ? item.subcategory_name
                  ? `${item.category_name} > ${item.subcategory_name}`
                  : item.category_name
                : "No category"}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "gray", marginTop: 40 }}>
            No products found
          </Text>
        }
      />

      <FAB
        icon="plus"
        style={{ position: "absolute", right: 16, bottom: 16 }}
        onPress={() => router.push("/product-form")}
      />

      {/* Manage Modal */}
      <Portal>
        <Dialog visible={showManage} onDismiss={closeManage}>
          <Dialog.Title>Manage Categories</Dialog.Title>

          {/* Dialog.ScrollArea is the correct RNP pattern for scrollable dialog content */}
          <Dialog.ScrollArea style={{ maxHeight: 400, paddingHorizontal: 0 }}>
            <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
              <Text
                variant="labelSmall"
                style={{
                  paddingHorizontal: 24,
                  paddingBottom: 4,
                  color: "gray",
                }}
              >
                CATEGORIES — tap to expand subcategories
              </Text>

              {manageCategories.length === 0 && (
                <Text
                  style={{
                    paddingHorizontal: 24,
                    color: "gray",
                    paddingVertical: 8,
                  }}
                >
                  No categories found
                </Text>
              )}

              {manageCategories.map((cat) => (
                <View key={cat.id}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingLeft: 24,
                      paddingRight: 8,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleManageCategoryPress(cat.id)}
                      style={{ flex: 1, paddingVertical: 10 }}
                    >
                      <Text
                        variant="bodyMedium"
                        style={{
                          color:
                            manageSelectedCategory === cat.id
                              ? "#16a34a"
                              : "black",
                          fontWeight:
                            manageSelectedCategory === cat.id ? "700" : "400",
                        }}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                    <IconButton
                      icon="delete-outline"
                      size={20}
                      iconColor="#ef4444"
                      onPress={() =>
                        setDeleteTarget({
                          id: cat.id,
                          name: cat.name,
                          type: "category",
                        })
                      }
                    />
                  </View>

                  {/* Subcategories inline under selected category */}
                  {manageSelectedCategory === cat.id && (
                    <View
                      style={{
                        marginLeft: 32,
                        marginRight: 8,
                        marginBottom: 8,
                        borderLeftWidth: 2,
                        borderLeftColor: "#16a34a",
                        paddingLeft: 12,
                      }}
                    >
                      {manageSubcategories.length === 0 ? (
                        <Text
                          variant="bodySmall"
                          style={{ color: "gray", paddingVertical: 6 }}
                        >
                          No subcategories
                        </Text>
                      ) : (
                        manageSubcategories.map((sub) => (
                          <View
                            key={sub.id}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text variant="bodySmall">{sub.name}</Text>
                            <IconButton
                              icon="delete-outline"
                              size={18}
                              iconColor="#ef4444"
                              onPress={() =>
                                setDeleteTarget({
                                  id: sub.id,
                                  name: sub.name,
                                  type: "subcategory",
                                })
                              }
                            />
                          </View>
                        ))
                      )}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </Dialog.ScrollArea>

          <Dialog.Actions>
            <Button onPress={closeManage}>Close</Button>
          </Dialog.Actions>
        </Dialog>

        {/* Delete Confirm */}
        <Dialog
          visible={!!deleteTarget}
          onDismiss={() => setDeleteTarget(null)}
        >
          <Dialog.Title>
            Delete{" "}
            {deleteTarget?.type === "category" ? "Category" : "Subcategory"}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete "{deleteTarget?.name}"?
              {deleteTarget?.type === "category" &&
                " All its subcategories will also be deleted."}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteTarget(null)}>Cancel</Button>
            <Button textColor="#ef4444" onPress={handleDelete}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
