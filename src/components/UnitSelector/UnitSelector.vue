<template>
  <div class="unit-selector">
    <Select
      :model-value="currentUnitSlug"
      :options="unitOptions"
      size="md"
      @update:model-value="handleUnitChange"
      class="unit-selector-select"
    />
  </div>
</template>

<script setup lang="ts">
import "./UnitSelector.css";
import { Select } from "@components";
import { useUnitNavigation } from "@hooks";

const { currentUnitSlug, handleUnitChange, unitOptions } = useUnitNavigation();
</script>
