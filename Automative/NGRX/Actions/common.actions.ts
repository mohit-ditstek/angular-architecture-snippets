import { createAction, props } from '@ngrx/store';

import {
  ActionPayloadData,
  DMSPushDealRequest,
  DealTabType,
  DealType,
  QuickActionRequest,
  UpdateContactsRequest
} from '@app/entities';
import { DealTabPath } from '../../enum';
import { Deal, DealLender, DealOverview, DealTabLocks, DealUnlockResponse, QuickActionUpdateRequest } from '../../models';

export const newDeal = createAction('[Deal] New Deal');

export const getDeal = createAction('[Deal] Get Deal', props<ActionPayloadData<number>>());
export const getDealSuccess = createAction('[Deal] Get Deal Success', props<ActionPayloadData<Deal>>());
export const getDealFailure = createAction('[Deal] Get Deal Failure');

export const updateContacts = createAction('[Deal] Update Contacts', props<ActionPayloadData<UpdateContactsRequest>>());
export const updateContactsSuccess = createAction('[Deal] Update Contacts Success', props<ActionPayloadData<UpdateContactsRequest>>());
export const updateContactsFailure = createAction('[Deal] Update Contacts Failure');

export const updateDocsNotesCount = createAction('[Deal] Update Docs Notes Count', props<ActionPayloadData<DealOverview>>());
export const updateDealOverviewDetails = createAction('[Deal] Update Deal Overview Details', props<ActionPayloadData<DealOverview>>());

export const setNotesCount = createAction('[Deal] Set Notes Count', props<ActionPayloadData<number>>());
export const updateNotesCount = createAction('[Deal] Update Notes Count');
export const updateDocsCount = createAction('[Deal] Update Docs Count', props<ActionPayloadData<number>>());
// common deal header

export const primaryCustomerNameUpdate = createAction('[Deal] Primary Customer Name Update', props<ActionPayloadData<string>>());
export const primaryUnitUpdate = createAction('[Deal] Primary Unit Update', props<ActionPayloadData<string>>());
export const updateLenderName = createAction('[Deal] Primary Lender Name Update', props<ActionPayloadData<DealLender>>());
export const totalDealAmountUpdate = createAction('[Deal] Total Deal Amount Update', props<ActionPayloadData<{ totalAmount: number; dealType: DealType }>>());
export const setDeliveryDate = createAction('[Deal] Set Delivery Date', props<ActionPayloadData<Date>>());
export const lastUpdateDateTimeUpdate = createAction('[Deal] Last Updated Date Time Update');

export const dealTab = createAction('[Deal] Deal Tab', props<ActionPayloadData<DealTabPath>>());

export const openRateProductDialog = createAction('[Deal] Open Rate Product Dialog', props<ActionPayloadData<boolean>>());
export const openPresentDialog = createAction('[Deal] Open Present Dialog', props<ActionPayloadData<boolean>>());

export const updateDealTabLocks = createAction('[Deal] Update Deal Tab Locks', props<ActionPayloadData<DealTabLocks>>());

export const updateDealTabUnLocks = createAction('[Deal] Update Deal Tab Un-Locks', props<ActionPayloadData<DealTabType>>());
export const updateDealTabUnLocksSuccess = createAction('[Deal] Update Deal Tab Un-Locks Success', props<ActionPayloadData<DealUnlockResponse>>());
export const updateDealTabUnLocksFailure = createAction('[Deal] Update Deal Tab Un-Locks Failure');

export const unlockEvent = createAction('[Deal] UNLOCK TAB EVENT', props<ActionPayloadData<boolean>>());
export const resetEvent = createAction('[Deal] REST EVENT');
export const resetTabEvent = createAction('[Deal] REST TAB EVENT');


// Deal actions
export const createCloneDeal = createAction('[Deal] Create Clone Deal', props<ActionPayloadData<QuickActionRequest>>());
export const createCloneDealSuccess = createAction('[Deal] Create Clone Deal Success', props<ActionPayloadData<number>>());
export const createCloneDealFailure = createAction('[Deal] Create Clone Deal Failure');

export const deleteDeal = createAction('[Deal] Delete Deal', props<ActionPayloadData<QuickActionRequest>>());
export const deleteDealSuccess = createAction('[Deal] Delete Deal Success', props<ActionPayloadData<number>>());
export const deleteDealFailure = createAction('[Deal] Delete Deal Failure');

export const markDeadDeal = createAction('[Deal] Mark Dead Deal', props<ActionPayloadData<QuickActionRequest>>());
export const markDeadDealSuccess = createAction('[Deal] Mark Dead Deal Success', props<ActionPayloadData<number>>());
export const markDeadDealFailure = createAction('[Deal] Mark Dead Deal Failure');

export const dmsRefresh = createAction('[Menu] Deal Re-import', props<ActionPayloadData<number>>());
export const dmsRefreshSuccess = createAction('[Menu] Deal Re-import Success', props<ActionPayloadData<number>>());
export const dmsRefreshFailure = createAction('[Menu] Deal Re-import Failure');

export const dmsUpdate = createAction('[Menu] DMS Update Deal', props<ActionPayloadData<number>>());
export const dmsUpdateSuccess = createAction('[Menu] DMS Update Deal Success');
export const dmsUpdateFailure = createAction('[Menu] DMS Update Deal Failure');

export const blockUnblockDeal = createAction('[Deal] Mark Block Unblock Deal', props<ActionPayloadData<QuickActionRequest>>());
export const blockUnblockDealSuccess = createAction('[Deal] Mark Block UnBlock Deal Success', props<ActionPayloadData<number>>());
export const blockUnblockDealFailure = createAction('[Deal] Mark Block UnBlock Deal Failure');

export const closeDeal = createAction('[Deal] Mark Close Deal', props<ActionPayloadData<QuickActionUpdateRequest>>());
export const closeDealSuccess = createAction('[Deal] Mark Close Deal Success', props<ActionPayloadData<number>>());
export const closeDealFailure = createAction('[Deal] Mark Close Deal Failure');

export const dmsPushDeal = createAction('[Deal] DMS Push Deal', props<ActionPayloadData<DMSPushDealRequest>>());
export const dmsPushDealSuccess = createAction('[Deal] DMS Push Deal Success', props<ActionPayloadData<any>>());
export const dmsPushDealFailure = createAction('[Deal] DMS Push Deal Failure');

export const resetDealType = createAction('[Deal] Reset Deal');