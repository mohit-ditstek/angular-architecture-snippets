import { Action, createReducer, on } from '@ngrx/store';
import { StartNumOrder, Unit, UnitMarineSubType, UnitOptionOverview, UnitType } from '@app/entities';
import * as UnitActions from '../actions';

export interface TabState<T> {
  activeTab: number;
  subActiveTab: number;
  items: T[];
  lastNumOrder: number;
  unitsReordered: boolean;
  isValid: boolean;
  isDirty: boolean;
}
export interface UnitDetails {
  units: TabState<Unit>;
  options: UnitOptionOverview[];
}

export interface UnitsState {
  currentChanges: UnitDetails;
  previousChanges: UnitDetails;
  loaded: boolean;
  openRatingDialog: boolean;
  unitLoaded: boolean;
}

export const initialUnitState: UnitsState = {
  currentChanges: {
    units: {
      items: [],
      activeTab: -1,
      subActiveTab: -1,
      lastNumOrder: StartNumOrder.Unit,
      isDirty: false,
      isValid: false,
      unitsReordered: false,
    },
    options: [],
  },
  previousChanges: {
    units: {
      items: [],
      activeTab: -1,
      subActiveTab: -1,
      lastNumOrder: StartNumOrder.Unit,
      isDirty: false,
      isValid: false,
      unitsReordered: false,
    },
    options: [],
  },
  loaded: false,
  unitLoaded: false,
  openRatingDialog: false,
};

const reducer = createReducer(
  initialUnitState,
  on(UnitActions.getUnitsTabDataSuccess, (state, { data }) => {
    const { units, options } = data;
    const unitsCount = units.length;
    const unitItems = unitsCount > 0 ? units : [new Unit(StartNumOrder.Unit)];
    // numOrder computation
    const numOrder = Math.max(...unitItems.map((u) => u.numOrder));

    const groupedUnits: Unit[] = [];

    const mainUnits = unitItems.filter((u) => !u.mainUnitId);
    for (const unit of mainUnits) {
      let subUnits = [];
      if (unit.type == UnitType.Marine) {
        subUnits = unitItems.filter((u) => u.mainUnitId == unit.unitId);
      }

      groupedUnits.push({ ...unit, subUnits });
    }
    
    // TODO: Need to remove once multiple delete api is done.
    if (groupedUnits.length == 0) {
      groupedUnits.push(new Unit(StartNumOrder.Unit));
    }
    groupedUnits.sort((a, b) => a.numOrder - b.numOrder);

    const loaded = state.loaded;
    const { activeTab, subActiveTab, isValid, isDirty } = state.currentChanges.units;
    // Check all units valid

    const updatedDetails = {
      units: {
        items: groupedUnits,
        activeTab: loaded ? activeTab : 0,
        subActiveTab: loaded ? subActiveTab : -1,
        lastNumOrder: numOrder,
        isDirty: loaded ? isDirty : false,
        isValid: loaded ? isValid : unitsCount > 0,
        unitsReordered: false,
      },
      options: options,
    };

    return {
      loaded: true,
      unitLoaded: true,
      currentChanges: { ...updatedDetails },
      previousChanges: { ...updatedDetails },
      openRatingDialog: false,
    };
  }),

  on(UnitActions.addUnit, (state) => {
    const { currentChanges } = state;
    const { items, lastNumOrder } = currentChanges.units;

    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        units: {
          ...currentChanges.units,
          items: [...items, new Unit(lastNumOrder + 1)],
          activeTab: items.length,
          lastNumOrder: lastNumOrder + 1,
          subActiveTab: -1,
          isValid: false,
        },
      },
    };
  }),

  on(UnitActions.addSubUnit, (state, { data }) => {
    const { currentChanges } = state;
    const { units } = currentChanges;
    const { items, activeTab, subActiveTab, lastNumOrder } = units;
    const { unitId, type, subUnits } = items[activeTab];
    const { clone, subType } = data;
    const existingSubUnits = subUnits || [];
    const activeUnit = subActiveTab > -1 ? subUnits[subActiveTab] : items[activeTab];
    const newSubunit = { ...activeUnit };
    if (!clone && subType == UnitMarineSubType.Engine) {
      delete newSubunit.year;
      delete newSubunit.make;
      delete newSubunit.model;
      delete newSubunit.msrp;
      delete newSubunit.category;
      delete newSubunit.invoice;
      delete newSubunit.engineSize;
      delete newSubunit.enginePower;
      delete newSubunit.hours;
      delete newSubunit.color;
      delete newSubunit.description;
    }
    let newUnit = clone ? { ...activeUnit } : !clone && subType == UnitMarineSubType.Generator ? new Unit() : newSubunit;
    newUnit = { ...newUnit, mainUnitId: unitId, type, subType, vin: null, numOrder: lastNumOrder + 1 };
    delete newUnit.unitId;
    delete newUnit.stockNo;
    if (subType == UnitMarineSubType.Generator) {
      newUnit = { ...newUnit, inServiceDate: items[activeTab].inServiceDate };
    }
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        units: {
          ...units,
          items: items.map((u, i) => {
            if (i === activeTab) {
              return Object.assign({}, u, { subUnits: [...existingSubUnits, newUnit] });
            }
            return u;
          }),
          subActiveTab: existingSubUnits.length,
          isDirty: clone,
          lastNumOrder: lastNumOrder + 1,
        },
      },
    };
  }),

  on(UnitActions.unitTabChange, (state, payload) => {
    const { currentChanges } = state;
    const { units } = currentChanges;
    const { unitsReordered } = units;
    return {
      ...state,
      currentChanges: {
        ...state.currentChanges,
        units: {
          ...state.currentChanges.units,
          activeTab: payload.data,
          isDirty: !!unitsReordered,
          subActiveTab: -1,
        },
      },
    };
  }),
  on(UnitActions.unitSubTabChange, (state, payload) => ({
    ...state,
    currentChanges: {
      ...state.currentChanges,
      units: {
        ...state.currentChanges.units,
        subActiveTab: payload.data,
      },
    },
  })),

  on(UnitActions.deleteUnitSuccess, (state, { data }) => {
    const { currentChanges } = state;
    const { options, units } = currentChanges;
    const { items, activeTab, subActiveTab } = units;

    const { unitId } = items[data];

    const existingUnits = [...items];
    existingUnits.splice(data, 1);

    if (existingUnits.length == 0) {
      existingUnits.push(new Unit(StartNumOrder.Unit));
    }

    const existingUnitOptions = options.filter((u) => u.unitId !== unitId);

    const isCurrentTab = data == activeTab;
    const activeTabIndex = isCurrentTab ? 0 : data < activeTab ? activeTab - 1 : activeTab;

    const updatedDetails = {
      activeTab: activeTabIndex,
      isValid: isCurrentTab ? true : units.isValid,
      isDirty: isCurrentTab ? false : units.isDirty,
      subActiveTab: isCurrentTab ? -1 : subActiveTab,
    };

    const filteredUnits = existingUnits.filter((u) => u.unitId);

    return {
      ...state,
      currentChanges: {
        units: {
          ...units,
          ...updatedDetails,
          items: existingUnits,
        },
        options: existingUnitOptions,
      },
      previousChanges: {
        units: {
          ...units,
          ...updatedDetails,
          activeTab: 0,
          items: filteredUnits.length > 0 ? filteredUnits : existingUnits,
        },
        options: existingUnitOptions,
      },
    };
  }),

  on(UnitActions.deleteSubUnitSuccess, (state, { data }) => {
    const { currentChanges, previousChanges } = state;
    const { units } = currentChanges;
    const { items, activeTab } = units;
    const { subUnits } = items[activeTab];

    const existingSubUnits = [...subUnits];
    if (data > -1) existingSubUnits.splice(data, 1);

    const updatedUnits = {
      subActiveTab: -1,
      isDirty: false,
    };

    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        units: {
          ...units,
          ...updatedUnits,
          items: items.map((u, i) => {
            if (i === activeTab) {
              return Object.assign({}, u, { subUnits: existingSubUnits });
            }
            return u;
          }),
        },
      },
      previousChanges: {
        ...previousChanges,
        units: {
          ...units,
          ...updatedUnits,
          activeTab: 0,
          subActiveTab: -1,
          items: items.map((u, i) => {
            if (i === activeTab) {
              return Object.assign({}, u, { subUnits: existingSubUnits.filter((su) => su.unitId) });
            }
            return u;
          }),
        },
      },
    };
  }),

  on(UnitActions.unitDetailsUpdated, (state, { data }) => {
    const { currentChanges } = state;
    const { units } = currentChanges;
    const { items, activeTab, subActiveTab } = units;
    const { unitDetails, isDirty, isValid } = data;
    const trollingMotor = !unitDetails.hasTrollingMotor ? null : unitDetails.trollingMotorSerialNumber;
    const updatedUnits = {
      ...units,
      items: items.map((u, i) => {
        if (activeTab == i) {
          if (subActiveTab > -1) {
            const subUnits = u.subUnits.map((su, index) => {
              if (subActiveTab == index) {
                return Object.assign({}, { ...unitDetails });
              }
              return su;
            });

            return Object.assign({}, u, { subUnits });
          }

          return Object.assign({}, { ...unitDetails, trollingMotorSerialNumber: trollingMotor });
        }

        return u;
      }),
      isDirty,
      isValid,
    };
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        units: { ...updatedUnits },
      },
    };
  }),

  on(UnitActions.autoSaveMultiUnitSuccess, (state, { data }) => {
    const { currentChanges, previousChanges } = state;
    const { units } = currentChanges;
    const { items, isValid, activeTab, unitsReordered } = units;
    const addUnits = data.units;
    const updatedUnits = {
      ...units,
      items: items.map((u, i) => {
        if (activeTab == i) {
          const mergedArray = unitsReordered ? [...u.subUnits] :[...u.subUnits, ...addUnits];
          const uniqueData = [...mergedArray.reduce((map, obj) => map.set(obj.numOrder, obj), new Map()).values()];
          return Object.assign({}, u, { unitId: u.unitId, subUnits: uniqueData });
        }
        return u;
      }),
      lastNumOrder: addUnits[addUnits.length - 1].numOrder,
      isDirty: false,
      isValid,
      unitsReordered: false,
    };
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        units: { ...updatedUnits },
      },
      previousChanges: {
        ...previousChanges,
        units: { 
          ...updatedUnits, 
          items: updatedUnits.items.filter(u => u.unitId), 
          activeTab: 0 
        },
      },
    };
  }),

  on(UnitActions.autoSaveUnitSuccess, (state, { data }) => {
    const { currentChanges, previousChanges } = state;
    const { units } = currentChanges;
    const { items, isValid, activeTab, subActiveTab } = units;
    let lastNumOrder = -1;
    const updatedUnits = {
      ...units,
      items: items.map((u, i) => {
        if (activeTab == i) {
          if (subActiveTab > -1) {
            const subUnits = u.subUnits.map((su, index) => {
              if (subActiveTab == index) {
                if (!su.unitId) lastNumOrder = data.numOrder;
                return Object.assign({}, su, { unitId: data.unitId, numOrder: su.numOrder ?? data.numOrder });
              }
              return su;
            });

            return Object.assign({}, u, { subUnits });
          }
          return Object.assign({}, u, { unitId: data.unitId, subUnits: data.subUnits?.length > 0 ? data.subUnits : u.subUnits });
        }
        return u;
      }),
      lastNumOrder: lastNumOrder > -1 ? lastNumOrder : units.lastNumOrder,
      isDirty: false,
      isValid,
    };
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        units: { ...updatedUnits },
      },
      previousChanges: {
        ...previousChanges,
        units: { ...updatedUnits },
      },
    };
  }),
  on(UnitActions.updateUnitSuccess, (state, payload) => {
    const { currentChanges, previousChanges } = state;
    const { units } = currentChanges;
    const { items, isValid } = units;

    let existingData = [...items];
    const unit = payload.data;
    if (unit.subType == UnitMarineSubType.Engine || unit.subType == UnitMarineSubType.Generator) {
      existingData = existingData.map((u) => {
        if (u.subUnits) {
          const subUnits = u.subUnits.map((su) => {
            if (su.numOrder == unit.numOrder) {
              return Object.assign({}, su, { ...unit });
            }
            return su;
          });
          return Object.assign({}, u, { subUnits });
        }
        return u;
      });
    } else {
      const index = existingData.findIndex((i) => i.numOrder == unit.numOrder);
      if (index > -1) existingData[index] = { ...existingData[index], ...unit };
    }

    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        units: { ...units, items: existingData },
      },
      previousChanges: {
        ...previousChanges,
        units: { ...units, items: existingData.filter((u) => u.unitId) },
      },
    };
  }),
  on(UnitActions.updateUnitsAfterValidate, (state, { data }) => {
    const { currentChanges } = state;
    const { units } = currentChanges;
    const updatedUnits = units.items.map((u) => {
      const hasMatchedUnit = data.find((d) => d.unitId == u.unitId);
      if (hasMatchedUnit) return Object.assign({}, hasMatchedUnit);
      return u;
    });
    return {
      ...state,
      currentChanges: { ...currentChanges, units: { ...units, items: updatedUnits } },
      previousChanges: { ...currentChanges, units: { ...units, items: updatedUnits } },
    };
  }),
  on(UnitActions.updateUnitType, (state, { data }) => {
    const { currentChanges } = state;
    const { units } = currentChanges;
    const { items } = units;
    const { type, activeUnitTab } = data;
    const index = items.findIndex((i) => i.numOrder == activeUnitTab + 1);
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        units: {
          ...units,
          items: items.map((u, i) => {
            if (i == index) {
              return Object.assign({}, u, { type: type });
            }
            return u;
          }),
        },
      },
    };
  }),
  on(UnitActions.editAccessorySuccess, (state, { data }) => {
    const { currentChanges, previousChanges } = state;
    const { options } = currentChanges;
    const unitOptionIndex = options.findIndex((a) => a.id == data.id);
    const updatedOptions = options.map((a, i) => {
      if (unitOptionIndex == i) {
        return Object.assign({}, a, data);
      }
      return a;
    });

    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        options: updatedOptions,
      },
      previousChanges: {
        ...previousChanges,
        options: updatedOptions,
      },
    };
  }),
  on(UnitActions.deleteAccessory, (state, { data }) => {
    const { currentChanges, previousChanges } = state;
    const { options } = currentChanges;
    const existingAccessories = [...options];
    const index = existingAccessories.findIndex((a) => a.id == data.id);
    existingAccessories.splice(index, 1);

    return {
      ...state,
      currentChanges: { ...currentChanges, options: existingAccessories },
      previousChanges: { ...previousChanges, options: existingAccessories },
    };
  }),
  on(UnitActions.setOpenRatingDialog, (state, { data }) => ({
    ...state,
    openRatingDialog: data,
  })),
  on(UnitActions.resetEvent, () => {
    return Object.assign({}, initialUnitState);
  }),
  on(UnitActions.resetTabEvent, (state) => ({
    ...state,
    currentChanges: { ...state.previousChanges },
  })),

  on(UnitActions.addAccessorySuccess, (state, { data }) => {
    const { currentChanges, previousChanges } = state;
    const { options } = currentChanges;
    const existingAccessories = [...options];
    const updatedOptions = [...options, data as unknown as UnitOptionOverview];

    return {
      ...state,
      currentChanges: { ...currentChanges, options: updatedOptions },
      previousChanges: { ...previousChanges, options: existingAccessories },
    };
  }),

  on(UnitActions.updateUnitFormStatus, (state, { data }) => {
    const { currentChanges, previousChanges } = state;
    const { units } = currentChanges;
    const { isValid, activeTab } = state.currentChanges.units;
    const previousActiveTab = state.previousChanges.units.activeTab;

    const updatedUnits = {
      ...units,
      isDirty: data.formDirty,
      isValid: previousActiveTab === activeTab ? data.formValid : isValid,
    };
    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        units: { ...updatedUnits },
      },
      previousChanges: {
        ...previousChanges,
        units: { ...updatedUnits },
      },
    };
  }),
  on(UnitActions.addImportUnitSuccess, (state) => {
    return {
      ...state,
      unitLoaded: false,
    };
  }),
  on(UnitActions.updateImportUnitSuccess, (state) => {
    return {
      ...state,
      unitLoaded: false,
    };
  }),

  on(UnitActions.autoSaveUnitFailure, (state) => {
    const { currentChanges } = state;
    const { units } = currentChanges;

    const updatedUnits = {
      ...units,
      isDirty: false,
      isValid: true,
    };

    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        units: { ...updatedUnits },
      },
    };
  }),

  on(UnitActions.updateUnitsDetail, (state, { data }) => {
    const { currentChanges, previousChanges } = state;
    const { units } = currentChanges;
    const updatedItems = units.items.map((item) => {
      const selectedItem = data.find((i) => i.id === item.unitId);
      if (selectedItem) {
        const { inServiceDate, deliveryDate } = selectedItem;
        return { ...item, inServiceDate, deliveryDate };
      }
      return item;
    });
    const updatedUnits = {
      ...units,
      items: updatedItems,
    };

    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        units: updatedUnits,
      },
      previousChanges: {
        ...previousChanges,
        units: updatedUnits,
      },
    };
  }),

  on(UnitActions.reorderUnits, (state, { data }) => {
    const { currentChanges } = state;

    const { units } = currentChanges;
    const { currentIndex } = data;

    const updateUnits = units.items.map((unit) => {
      const unitIndex = data.tabs.findIndex((t) => t.numOrder == unit.numOrder);
      if (unitIndex > -1) return { ...unit, numOrder: unitIndex + 1 };
      return unit;
    });

    let lastNumOrder = data.tabs.length;
    const updateSubUnits = updateUnits
      .map((unit) => {
        let subUnits = [];
        if (unit.subUnits?.length > 0) {
          subUnits = unit.subUnits.map((su) => {
            lastNumOrder = lastNumOrder + 1;
            return { ...su, numOrder: lastNumOrder };
          });
        }
        return { ...unit, subUnits };
      })
      .sort((a, b) => a.numOrder - b.numOrder);

    return {
      ...state,
      currentChanges: {
        ...currentChanges,
        units: {
          ...units,
          items: updateSubUnits,
          activeTab: currentIndex,
          unitsReordered: true,
          isDirty: true,
        },
      }
    };
  })
);
export function unitsReducer(state: UnitsState, action: Action) {
  return reducer(state, action);
}
