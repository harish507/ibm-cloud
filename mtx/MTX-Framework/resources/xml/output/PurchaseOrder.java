
package output;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * &lt;p&gt;Java class for anonymous complex type.
 * 
 * &lt;p&gt;The following schema fragment specifies the expected content contained within this class.
 * 
 * &lt;pre&gt;
 * &amp;lt;complexType&amp;gt;
 *   &amp;lt;complexContent&amp;gt;
 *     &amp;lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&amp;gt;
 *       &amp;lt;sequence&amp;gt;
 *         &amp;lt;element name="memberno" type="{http://www.w3.org/2001/XMLSchema}int"/&amp;gt;
 *         &amp;lt;element name="ordername" type="{http://www.w3.org/2001/XMLSchema}string"/&amp;gt;
 *         &amp;lt;element name="ponumber" type="{http://www.w3.org/2001/XMLSchema}int"/&amp;gt;
 *         &amp;lt;element name="poorderno" type="{http://www.w3.org/2001/XMLSchema}int"/&amp;gt;
 *         &amp;lt;element name="streetno" type="{http://www.w3.org/2001/XMLSchema}string"/&amp;gt;
 *       &amp;lt;/sequence&amp;gt;
 *     &amp;lt;/restriction&amp;gt;
 *   &amp;lt;/complexContent&amp;gt;
 * &amp;lt;/complexType&amp;gt;
 * &lt;/pre&gt;
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "memberno",
    "ordername",
    "ponumber",
    "poorderno",
    "streetno"
})
@XmlRootElement(name = "purchaseOrder")
public class PurchaseOrder {

    protected int memberno;
    @XmlElement(required = true)
    protected String ordername;
    protected int ponumber;
    protected int poorderno;
    @XmlElement(required = true)
    protected String streetno;

    /**
     * Gets the value of the memberno property.
     * 
     */
    public int getMemberno() {
        return memberno;
    }

    /**
     * Sets the value of the memberno property.
     * 
     */
    public void setMemberno(int value) {
        this.memberno = value;
    }

    /**
     * Gets the value of the ordername property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getOrdername() {
        return ordername;
    }

    /**
     * Sets the value of the ordername property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setOrdername(String value) {
        this.ordername = value;
    }

    /**
     * Gets the value of the ponumber property.
     * 
     */
    public int getPonumber() {
        return ponumber;
    }

    /**
     * Sets the value of the ponumber property.
     * 
     */
    public void setPonumber(int value) {
        this.ponumber = value;
    }

    /**
     * Gets the value of the poorderno property.
     * 
     */
    public int getPoorderno() {
        return poorderno;
    }

    /**
     * Sets the value of the poorderno property.
     * 
     */
    public void setPoorderno(int value) {
        this.poorderno = value;
    }

    /**
     * Gets the value of the streetno property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStreetno() {
        return streetno;
    }

    /**
     * Sets the value of the streetno property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStreetno(String value) {
        this.streetno = value;
    }

}
