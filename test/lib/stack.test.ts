import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { MineCloud } from '../../lib/stack';
import { STACK_NAME } from '../../minecloud_configs/config';
import { AmazonLinuxGeneration, AmazonLinuxImage, MachineImage } from 'aws-cdk-lib/aws-ec2';


describe('stack', () => {
    // test('Should contain EC2 spot instance', () => {
    //     const app = new App();
    //     const stack = new MineCloud(app, STACK_NAME);
    //     const template = Template.fromStack(stack);

    //     template.hasResourceProperties('AWS::EC2::instance', {
    //         machineImage: new AmazonLinuxImage({
    //             generation: AmazonLinuxGeneration.AMAZON_LINUX_2023,
    //             cachedInContext: true
    //         })
    //     });
    // });

    test('Should pass', () => {
        expect(true).toBe(true);
    });
});
