import { Key } from 'react';
import { ProfileFarm, ProfileUser } from './profile.type';
export declare function getProfileInitials(user: ProfileUser): string;
export declare function getFarmInitials(farm: ProfileFarm): string;
export declare function getFarmKey(farm: ProfileFarm, index: number): Key;
export declare function getVisibleFarms(farms: ProfileFarm[], startIndex: number, visibleCount: number): ProfileFarm[];
