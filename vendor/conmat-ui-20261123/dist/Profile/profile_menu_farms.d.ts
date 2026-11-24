import { ProfileFarm } from './profile.type';
interface Props {
    farms: ProfileFarm[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
}
export declare function ProfileMenuFarms({ farms, autoPlay, autoPlayInterval, }: Props): React.ReactNode;
export {};
