
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule'; // Cho Cycle jobs
import { AuthModule } from './auth/auth.module';
import { ValueModule } from './value/value.module';
import { CountryModule } from './country/country.module';
// Fix: Corrected import to use LedgerService as LedgerModule does not exist in ledger.service.ts
import { LedgerService } from './ledger/ledger.service';
import { RuleEngineService } from './rule-engine/rule-engine.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    ValueModule,
    CountryModule,
  ],
  // Fix: Registered LedgerService in providers for dependency injection
  providers: [RuleEngineService, LedgerService],
  // Fix: Exported LedgerService to make it available to other modules
  exports: [RuleEngineService, LedgerService],
})
export class AppModule {}