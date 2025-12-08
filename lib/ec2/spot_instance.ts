import { AmazonLinuxGeneration, AmazonLinuxImage, BlockDeviceVolume, CfnKeyPair, Instance, InstanceType, IVpc, KeyPair, LaunchTemplate, SecurityGroup, SpotInstanceInterruption, SpotRequestType } from "aws-cdk-lib/aws-ec2";
import { Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { EC2_INIT_TIMEOUT, EC2_INSTANCE_TYPE, EC2_VOLUME, MAX_PRICE } from "../../minecloud_configs/config";
import { STACK_PREFIX } from "../stack";
import { IGNORE_FAILURE_ON_INSTANCE_INIT } from "../../minecloud_configs/advanced_configs/other-configs";
import { Duration } from "aws-cdk-lib";
import { getInitConfig } from "../instance_init";

interface SpotInstanceProps {
    defaultVPC: IVpc,
    sshKeyPair: CfnKeyPair,
    ec2Role: Role,
    securityGroup: SecurityGroup,
    backupBucketName: string
}

export class SpotInstance extends Construct {
    public instance: Instance;

    constructor(scope: Construct, id: string, props: SpotInstanceProps) {
        super(scope, id);

        const instanceType = new InstanceType(EC2_INSTANCE_TYPE);
        const machineImage = new AmazonLinuxImage({
            generation: AmazonLinuxGeneration.AMAZON_LINUX_2023,
            cachedInContext: true
        });

        this.instance = new Instance(scope, `${id}-instance`, {
            vpc: props.defaultVPC,
            keyPair: KeyPair.fromKeyPairName(this, 'Ec2KeyPair', props.sshKeyPair.keyName),
            role: props.ec2Role,
            securityGroup: props.securityGroup,
            instanceType,
            machineImage,
            initOptions: {
                ignoreFailures: IGNORE_FAILURE_ON_INSTANCE_INIT,
                timeout: Duration.minutes(EC2_INIT_TIMEOUT),
                configSets: ['default']
            },
            blockDevices: [
            {
                deviceName: '/dev/xvda',
                volume: BlockDeviceVolume.ebs(EC2_VOLUME)
            }
            ],
            instanceName: STACK_PREFIX,
            
            // Note:
            // Making changes to init config will replace the old EC2 instance and
            // WILL RESULT IN DANGLING SPOT REQUEST AND EC2 INSTANCE
            // (YOU'LL NEED TO MANUALLY CANCEL THE DANGLING SPOT REQUEST TO AVOID SPINNING UP ADDITIONAL EC2 INSTANCE)
            init: getInitConfig(props.backupBucketName)
        });

        // Make this a spot instance
        const template = new LaunchTemplate(this, `${STACK_PREFIX}_ec2_launch_template`, {
        spotOptions: {
            interruptionBehavior: SpotInstanceInterruption.STOP,
            requestType: SpotRequestType.PERSISTENT,
            maxPrice: MAX_PRICE
        }
        });

        this.instance.instance.launchTemplate = {
            version: template.versionNumber,
            launchTemplateId: template.launchTemplateId
        };
    }
}