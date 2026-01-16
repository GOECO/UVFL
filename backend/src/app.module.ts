
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ValueModule } from './value/value.module';
import { CountryModule } from './country/country.module';
import { LedgerModule } from './ledger/ledger.module';

@Module({
  imports: [
    AuthModule,
    ValueModule,
    CountryModule,
    LedgerModule,
  ],
})
export class AppModule {}
