import { createSelector } from '@ngrx/store';
import { Unit, UnitMarineSubType, UnitType } from '@app/entities';
import { State } from '../deal.state';
import { UnitsState } from '../reducers';
import { getDealState } from './root.selector';

export const unitSelector = createSelector(getDealState, (state: State) => state.units);

export const loaded = createSelector(unitSelector, (state: UnitsState) => state.loaded);
export const unitLoaded = createSelector(unitSelector, (state: UnitsState) => state.unitLoaded);
export const openRatingDialog = createSelector(unitSelector, (state: UnitsState) => state.openRatingDialog);

export const unitsTab = createSelector(unitSelector, (state: UnitsState) => state.currentChanges.units);

export const units = createSelector(unitsTab, (unitsTab) => unitsTab.items);
export const lastNumOrder = createSelector(unitsTab, (unitsTab) => unitsTab.lastNumOrder);
export const unitsReordered = createSelector(unitsTab, (unitsTab) => unitsTab.unitsReordered);

export const unitOptions = createSelector(unitSelector, (state: UnitsState) => state.currentChanges.options);

export const isValid = createSelector(unitsTab, (unitsTab) => unitsTab.isValid);
export const isDirty = createSelector(unitsTab, (unitsTab) => unitsTab.isDirty);

export const activeUnitTabIndex = createSelector(unitsTab, (unitsTab) => unitsTab.activeTab);
export const activeSubUnitTabIndex = createSelector(unitsTab, (unitsTab) => unitsTab.subActiveTab);

export const unitsCount = createSelector(units, (units) => units.length);

export const activeSubUnits = createSelector(unitsTab, (unitsTab) => {
  const { items, activeTab } = unitsTab;
  const unit = { ...items[activeTab] };
  return unit.subUnits || [];
});

export const activeUnit = createSelector(unitsTab, (unitsTab) => {
  const { items, activeTab, subActiveTab } = unitsTab;
  let unit = { ...items[activeTab] };
  if (subActiveTab > -1) unit = unit.subUnits[subActiveTab];
  const { isOEMWarrantyActive } = unit;
  const warrantyStatus = isOEMWarrantyActive != null ? Number(isOEMWarrantyActive).toString() : null;
  return { ...unit, warrantyStatus };
});

export const marineUnitSidebar = createSelector(activeSubUnits, (activeSubUnits) => {
  const subUnits: any[] = [
    {
      text: UnitMarineSubType.Hull,
      value: -1,
    },
  ];

  for (let i = 0; i < activeSubUnits.length; i++) {
    subUnits.push({
      text: activeSubUnits[i].subType,
      value: i,
    });
  }

  // Sort subUnits
  subUnits.sort((a, b) => {
    const unitA = a.text.length;
    const unitB = b.text.length;

    let comparison = 0;
    if (unitA > unitB) {
      comparison = 1;
    } else if (unitA < unitB) {
      comparison = -1;
    }
    return comparison;
  });

  let counter = 0;
  return subUnits.map((u, i) => {
    counter = i > 0 && subUnits[i - 1].text != u.text ? 1 : ++counter;
    return Object.assign({}, u, { counter });
  });
});

export const unitViewModel = createSelector(
  loaded,
  units,
  unitsCount,
  activeUnitTabIndex,
  activeSubUnitTabIndex,
  activeUnit,
  unitOptions,
  activeSubUnits,
  unitLoaded,
  (loaded, units, unitsCount, activeUnitTabIndex, activeSubUnitTabIndex, activeUnit, unitOptions, activeSubUnits, unitLoaded) => {
    const totalPartsAccessories = unitOptions.reduce((total, current) => total + current.totalSellingPrice, 0);
    const invalidTabIndex = units.findIndex((u) => !u.unitId);

    const subUnits = units[activeUnitTabIndex]?.subUnits;

    const invalidSubTabIndex = subUnits ? subUnits.findIndex((su) => !su.unitId) : -1;

    const showTabDeleteIcon = units.filter((u) => u.unitId).length > 0;

    const indexEngineValue = filterSubUnits(subUnits, UnitMarineSubType.Engine);
    const indexGeneratorValue = filterSubUnits(subUnits, UnitMarineSubType.Generator);

    const isFirstUnitMarine = units.length > 0 ? units[0].type == UnitType.Marine : false;

    // Check marine category is Inboard or Stern drive
    const { category, subType } = activeUnit;
    let isPodDrive = false;
    if (subType == UnitMarineSubType.Engine && category) {
      isPodDrive = category.includes('Inboard') || category.includes('Stern Drive');
    }

    activeUnit = { ...activeUnit, isPodDrive };
    const unit = units[activeUnitTabIndex];
    const marineSubType = unit?.unitId > 0 && unit?.type == UnitType.Marine ? unit.subType : null;

    return {
      loaded,
      invalidTabIndex,
      unitsCount,
      activeUnitTabIndex,
      activeSubUnitTabIndex,
      activeUnit,
      unitOptions,
      totalPartsAccessories,
      invalidSubTabIndex,
      activeSubUnits,
      showTabDeleteIcon,
      subUnits,
      indexEngineValue,
      indexGeneratorValue,
      isFirstUnitMarine,
      units,
      unitLoaded,
      marineSubType,

    };
  }
);

export const marineSidebarViewModel = createSelector(activeSubUnitTabIndex, marineUnitSidebar, (activeSubUnitTabIndex, marineUnitSidebar) => {
  return { activeSubUnitTabIndex, marineUnitSidebar };
});

const filterSubUnits = (subUnits: Unit[], key: UnitMarineSubType) => {
  if (!subUnits) return false;
  return subUnits.filter((su) => su.subType == key).length > 1;
};
