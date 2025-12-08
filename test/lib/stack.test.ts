import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { MineCloud } from '../../lib/stack';
import { STACK_NAME } from '../../minecloud_configs/config';
import { describe, test } from 'node:test';

describe('stack', () => {
    const app = new App();
    const stack = new MineCloud(app, STACK_NAME, {
        env: {
            account: '123',
            region: 'eu-west-1'
        }
    });
    const template = Template.fromStack(stack);
    
    test('Should contain EC2 spot instance', () => {

        template.hasResourceProperties('AWS::EC2::Instance', {
            InstanceType: 't3.large',
            Tags: Match.arrayWith([{
                Key: 'Name',
                Value: 'MinecraftExample'
            }])
        });

        template.allResourcesProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                InstanceMarketOptions: {
                    MarketType: 'spot',
                    SpotOptions: {
                        InstanceInterruptionBehavior: 'stop',
                        SpotInstanceType: 'persistent'
                    }
                },
            }
        })
    });
});
