@component
export class BodyAttachment extends BaseScriptComponent {
    @input bodyTracker: ObjectTracking3D
    @input chestAttachment: SceneObject

    onAwake() {
        this.createEvent("OnStartEvent").bind(() => this.onStart())
    }

    onStart() {
        this.bodyTracker.onTrackingStarted = () => {
            // print("Tracking started")
        }

        this.bodyTracker.onTrackingLost = () => {
            // print("Tracking lost")
        }
        

        // this.chestAttachment.getTransform().setLocalPosition(vec3.zero())
        // this.bodyTracker.addAttachmentPoint("Spine2", this.chestAttachment)
        // print(this.chestAttachment.getParent().name)
    }
}
