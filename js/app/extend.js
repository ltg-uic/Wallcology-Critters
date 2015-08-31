/**
 * Critters Parent and Sub-class definitions
 *
 */


 function extend(ChildClass, ParentClass) {
    ChildClass.prototype = new ParentClass();
    ChildClass.prototype.constructor = ChildClass;
}

extend(FloraAgent, GenericAgent);
extend(ScumAgent, FloraAgent);
extend(BushAgent, FloraAgent);


extend(CritterAgent, GenericAgent);
extend(PredatorAgent, CritterAgent);
extend(PreyAgent, CritterAgent);



function GenericAgent() {
    this.name = null;
    this.Fitness = 0;
    this.Vigilance = 0;
    this.birthDate = new Date();
    this.isHungry = false;
    this.targetAcquired = false;
}


GenericAgent.prototype = {

    BroadCast(AgentGroup)


}