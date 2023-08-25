export const applicationDenyReasons = ["Некорректно введенные данные", "Невозможно с вами связаться через указанную соцсеть", "Вы не подтвердили свою личность через указанную соцсеть за 24 часа"];
export const adminBeatDeleteReasons = ["Бит нарушает правила BeatMarket", "Продал в другом месте", "Бит больше не продается"]

export function applicationDenyReason(reasonId) {
    return applicationDenyReasons[Number(reasonId)];
}