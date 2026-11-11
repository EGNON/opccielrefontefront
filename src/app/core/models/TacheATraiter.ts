export interface TacheATraiter {
    nombreOrdresEchus: number;
    nombreTitresEchus: number;
    nombreDetachementsCoupons: number;
    dateVerification?: string;
}

export interface NotificationTask {
    id: string;
    titre: string;
    description: string;
    nombre: number;
    type: 'ORDRE' | 'TITRE' | 'COUPON';
    icon: string;
}