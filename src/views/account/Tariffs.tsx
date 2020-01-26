import React from 'react';
import {ScrollView} from 'react-native';
import {TariffProps, Tariff} from './Tariff';

interface TariffsProps {}

let tariffs: TariffProps[] = [
  {
    title: 'за 1 документ',
    shortDescription: 'Некое пояснение',
    price: '20 000 сум',
    period: 'В месяц',
    description: `   Что то что то
    Что то что то
    Что то что то
    Что то что то`,
    reason: 'Некое пояснение',
  },
  {
    title: 'за 1 документ',
    shortDescription: 'Некое пояснение',
    price: '20 000 сум',
    period: 'В месяц',
    description: `   Что то что то
    Что то что то
    Что то что то
    Что то что то`,
    reason: 'Некое пояснение',
  },
  {
    title: 'за 1 документ',
    shortDescription: 'Некое пояснение',
    price: '20 000 сум',
    period: 'В месяц',
    description: `   Что то что то
    Что то что то
    Что то что то
    Что то что то`,
    reason: 'Некое пояснение',
  },
];

export const Tariffs: React.FC<TariffsProps> = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {tariffs.map(e => {
        return <Tariff {...e} />;
      })}
    </ScrollView>
  );
};
